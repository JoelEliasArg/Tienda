// productoControlador.js
const { Producto, Proveedor } = require('../baseDatos'); // Asegúrate de importar ambos modelos

module.exports = {
    async crearProducto(req, res) {
        try {
            // Sequelize usará activo: 1 por defecto al crear
            const producto = await Producto.create(req.body);
            res.status(201).json(producto);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Función para Listar (GET /productos) con filtro, ordenamiento e inclusión de Proveedor
    async obtenerProductos(req, res) { 
        try {
            const filtro = {};
            
            // 1. Lógica del Filtro Activo
            // Filtra por activo=0 si se solicita explícitamente, si no, usa activo=1 por defecto.
            if (req.query.activo === '0') {
                filtro.activo = 0; 
            } else {
                filtro.activo = 1; // Por defecto: solo activos (1)
            }

            // 2. Ejecutar la consulta con filtro, ordenamiento e inclusión de Proveedor
            const productos = await Producto.findAll({
                where: filtro, 
                order: [['nombre', 'ASC']], // Ordena alfabéticamente por nombre
                // Incluye el modelo Proveedor para que el frontend pueda mostrar el nombre
                include: [{ model: Proveedor, attributes: ['nombre'] }] 
            });

            res.json(productos);
        } catch (error) {
            console.error('Error al listar productos:', error);
            res.status(500).json({ error: 'Error interno al listar productos.' });
        }
    },

    async obtenerProductoPorId(req, res) {
        try {
            const producto = await Producto.findByPk(req.params.id);
            if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
            res.json(producto);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Función para Actualizar (PUT /productos/:id) - Maneja Edición y Soft Delete
    async actualizarProducto(req, res) {
        try {
            // Actualiza con los datos enviados, ya sean campos de edición o { activo: 0 }
            const [updated] = await Producto.update(req.body, { 
                where: { id: req.params.id } 
            });

            if (!updated) return res.status(404).json({ error: 'Producto no encontrado' });
            
            // Respuesta especial si se realizó el Soft Delete
            if (req.body.activo === 0) {
                 res.json({ mensaje: 'Producto desactivado correctamente' });
            } else {
                 res.json({ mensaje: 'Producto actualizado correctamente' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
};