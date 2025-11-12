const { Producto, Proveedor } = require('../baseDatos');

module.exports = {
    async crearProducto(req, res) {
        try {
            const producto = await Producto.create(req.body);
            res.status(201).json(producto);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async obtenerProductos(req, res) {
        try {
            const productos = await Producto.findAll({ include: [Proveedor] });
            res.json(productos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async obtenerProductoPorId(req, res) {
        try {
            const producto = await Producto.findByPk(req.params.id, { include: [Proveedor] });
            if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
            res.json(producto);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async actualizarProducto(req, res) {
        try {
            const [updated] = await Producto.update(req.body, { where: { id: req.params.id } });
            if (!updated) return res.status(404).json({ error: 'Producto no encontrado' });
            res.json({ mensaje: 'Producto actualizado correctamente' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async eliminarProducto(req, res) {
        try {
            const deleted = await Producto.destroy({ where: { id: req.params.id } });
            if (!deleted) return res.status(404).json({ error: 'Producto no encontrado' });
            res.json({ mensaje: 'Producto eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};
