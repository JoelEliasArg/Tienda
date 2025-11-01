const { Proveedor, Producto } = require('../baseDatos');

module.exports = {
    async crearProveedor(req, res) {
        try {
            const proveedor = await Proveedor.create(req.body);
            res.status(201).json(proveedor);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async obtenerProveedores(req, res) {
        try {
            const proveedores = await Proveedor.findAll({ include: [Producto] });
            res.json(proveedores);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async obtenerProveedorPorId(req, res) {
        try {
            const proveedor = await Proveedor.findByPk(req.params.id, { include: [Producto] });
            if (!proveedor) return res.status(404).json({ error: 'Proveedor no encontrado' });
            res.json(proveedor);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async actualizarProveedor(req, res) {
        try {
            const [updated] = await Proveedor.update(req.body, { where: { id: req.params.id } });
            if (!updated) return res.status(404).json({ error: 'Proveedor no encontrado' });
            res.json({ mensaje: 'Proveedor actualizado correctamente' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async eliminarProveedor(req, res) {
        try {
            const deleted = await Proveedor.destroy({ where: { id: req.params.id } });
            if (!deleted) return res.status(404).json({ error: 'Proveedor no encontrado' });
            res.json({ mensaje: 'Proveedor eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};
