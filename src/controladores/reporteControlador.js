const { Compra, Producto, Cliente, Proveedor, CompraProducto } = require('../baseDatos');
const { Op } = require('sequelize');

module.exports = {
    async ventasPorFecha(req, res) {
        try {
            const { fechaInicio, fechaFin } = req.query;
            const compras = await Compra.findAll({
                where: {
                    fecha: { [Op.between]: [fechaInicio, fechaFin] }
                },
                include: [Cliente, Producto]
            });
            res.json(compras);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async productosMasVendidos(req, res) {
        try {
            const productos = await CompraProducto.findAll({
                attributes: ['productoId', [CompraProducto.sequelize.fn('SUM', CompraProducto.sequelize.col('cantidad')), 'totalVendidos']],
                group: ['productoId'],
                order: [[CompraProducto.sequelize.literal('totalVendidos'), 'DESC']],
                include: [Producto]
            });
            res.json(productos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async proveedoresConMasProductos(req, res) {
        try {
            const proveedores = await Proveedor.findAll({
                include: [{ model: Producto }],
                order: [[{ model: Producto }, 'id', 'ASC']]
            });
            res.json(proveedores);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};
