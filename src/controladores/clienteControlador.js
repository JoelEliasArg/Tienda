const { Cliente } = require('../baseDatos');

module.exports = {
    async crearCliente(req, res) {
        try {
            const cliente = await Cliente.create(req.body);
            res.status(201).json(cliente);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async obtenerClientes(req, res) {
        try {
            const clientes = await Cliente.findAll();
            res.json(clientes);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async obtenerClientePorId(req, res) {
        try {
            const cliente = await Cliente.findByPk(req.params.id);
            if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
            res.json(cliente);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async actualizarCliente(req, res) {
        try {
            const [updated] = await Cliente.update(req.body, { where: { id: req.params.id } });
            if (!updated) return res.status(404).json({ error: 'Cliente no encontrado' });
            res.json({ mensaje: 'Cliente actualizado correctamente' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async eliminarCliente(req, res) {
        try {
            const deleted = await Cliente.destroy({ where: { id: req.params.id } });
            if (!deleted) return res.status(404).json({ error: 'Cliente no encontrado' });
            res.json({ mensaje: 'Cliente eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};
