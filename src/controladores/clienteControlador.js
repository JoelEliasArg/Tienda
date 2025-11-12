const { Cliente } = require('../baseDatos');

module.exports = {
    async crearCliente(req, res) {
        try {
            // Sequelize automáticamente usa activo: 1 por defecto
            const cliente = await Cliente.create(req.body); 
            res.status(201).json(cliente);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // 🔑 CLAVE: Función para Listar (GET /clientes)
    // Reemplaza a 'obtenerClientes' y aplica el filtro 'activo'.
    async listarClientes(req, res) {
        try {
            const filtro = {};
            
            // Lógica del Filtro Activo (esto ya funciona)
            if (req.query.activo === '0') {
                filtro.activo = 0; 
            } else {
                filtro.activo = 1; // Por defecto o si pide activo=1
            }

            // Ejecutar la consulta con el filtro y el ORDENAMIENTO
            const clientes = await Cliente.findAll({
                where: filtro, 
                
                // 🔑 CLAVE: Asegúrate de que esta línea esté bien escrita.
                // Ordena por el campo 'nombre' de forma ascendente (A-Z).
                order: [['nombre', 'ASC']] 
            });

            res.json(clientes);
        } catch (error) {
            console.error('Error al listar clientes:', error);
            res.status(500).json({ error: 'Error interno al listar clientes.' });
        }
    },

    async obtenerClientePorId(req, res) {
        try {
            const cliente = await Cliente.findByPk(req.params.id);
            // Aunque esté inactivo, se puede ver individualmente si se accede por ID
            if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' }); 
            res.json(cliente);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // 🔑 CLAVE: Función para Actualizar (PUT /clientes/:id)
    // Esta función maneja la EDICIÓN normal Y el SOFT DELETE (cuando req.body = { activo: 0 })
    async actualizarCliente(req, res) {
        try {
            const [updated] = await Cliente.update(req.body, { 
                where: { id: req.params.id } 
            });

            if (!updated) return res.status(404).json({ error: 'Cliente no encontrado' });
            
            // Verificamos si la actualización fue el Soft Delete
            if (req.body.activo === 0) {
                 res.json({ mensaje: 'Cliente desactivado correctamente' });
            } else {
                 res.json({ mensaje: 'Cliente actualizado correctamente' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

};