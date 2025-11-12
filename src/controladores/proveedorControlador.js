// proveedorControlador.js
const { Proveedor } = require('../baseDatos');

module.exports = {
    async crearProveedor(req, res) {
        try {
            // Sequelize automáticamente usará activo: 1 por defecto al crear
            const proveedor = await Proveedor.create(req.body);
            res.status(201).json(proveedor);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Función para Listar (GET /proveedores) con filtro y ordenamiento
    async obtenerProveedores(req, res) {
        try {
            const filtro = {};
            
            // 1. Lógica del Filtro Activo
            // Filtra por activo=0 si se solicita explícitamente, si no, usa activo=1 por defecto.
            if (req.query.activo === '0') {
                filtro.activo = 0; 
            } else {
                filtro.activo = 1; // Por defecto: solo activos
            }

            // 2. Ejecutar la consulta con filtro y ordenamiento
            const proveedores = await Proveedor.findAll({
                where: filtro, 
                order: [['nombre', 'ASC']] // Ordena alfabéticamente por nombre
            });

            res.json(proveedores);
        } catch (error) {
            console.error('Error al listar proveedores:', error);
            res.status(500).json({ error: 'Error interno al listar proveedores.' });
        }
    },

    async obtenerProveedorPorId(req, res) {
        try {
            const proveedor = await Proveedor.findByPk(req.params.id);
            if (!proveedor) return res.status(404).json({ error: 'Proveedor no encontrado' });
            res.json(proveedor);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Función para Actualizar (PUT /proveedores/:id) - Maneja Edición y Soft Delete
    async actualizarProveedor(req, res) {
        try {
            const [updated] = await Proveedor.update(req.body, { 
                where: { id: req.params.id } 
            });

            if (!updated) return res.status(404).json({ error: 'Proveedor no encontrado' });
            
            // Respuesta especial si se realizó el Soft Delete
            if (req.body.activo === 0) {
                 res.json({ mensaje: 'Proveedor desactivado correctamente' });
            } else {
                 res.json({ mensaje: 'Proveedor actualizado correctamente' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // ⚠️ La función eliminarProveedor (Hard Delete) se omite, ya que se usa Soft Delete con PUT.
};