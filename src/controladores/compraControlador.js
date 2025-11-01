const { Compra, Cliente, Producto, CompraProducto } = require('../baseDatos');

module.exports = {
    async crearCompra(req, res) {
        try {
            const { clienteId, productos } = req.body;
            if (!productos || !Array.isArray(productos) || productos.length === 0) {
                return res.status(400).json({ error: 'Debe incluir una lista de productos' });
            }

            // Calcular total
            const total = productos.reduce((sum, p) => sum + (p.precioUnitario * p.cantidad), 0);
            const compra = await Compra.create({ clienteId, total });

            // Crear relaciones en CompraProducto
            for (const p of productos) {
                await CompraProducto.create({
                    compraId: compra.id,
                    productoId: p.productoId,
                    cantidad: p.cantidad,
                    precioUnitario: p.precioUnitario,
                    subtotal: p.cantidad * p.precioUnitario
                });
            }

            res.status(201).json({ mensaje: 'Compra registrada', compra });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async obtenerCompras(req, res) {
        try {
            const compras = await Compra.findAll({
                include: [
                    { model: Cliente },
                    { model: Producto }
                ]
            });
            res.json(compras);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async obtenerCompraPorId(req, res) {
        try {
            const compra = await Compra.findByPk(req.params.id, {
                include: [
                    { model: Cliente },
                    { model: Producto }
                ]
            });
            if (!compra) return res.status(404).json({ error: 'Compra no encontrada' });
            res.json(compra);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};
