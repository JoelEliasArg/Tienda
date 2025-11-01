const { CompraProducto, Producto, Compra } = require('../baseDatos');

module.exports = {
    // Crear un detalle de compra (relación entre compra y producto)
    async crearDetalle(req, res) {
        try {
            const { compraId, productoId, cantidad, precioUnitario } = req.body;

            if (!compraId || !productoId || !cantidad || !precioUnitario) {
                return res.status(400).json({ error: 'Todos los campos son obligatorios' });
            }

            const subtotal = cantidad * precioUnitario;

            const detalle = await CompraProducto.create({
                compraId,
                productoId,
                cantidad,
                precioUnitario,
                subtotal
            });

            res.status(201).json(detalle);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Obtener todos los detalles de compras
    async obtenerDetalles(req, res) {
        try {
            const detalles = await CompraProducto.findAll({
                include: [Compra, Producto]
            });
            res.json(detalles);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Obtener detalles por compra específica
    async obtenerDetallesPorCompra(req, res) {
        try {
            const { compraId } = req.params;
            const detalles = await CompraProducto.findAll({
                where: { compraId },
                include: [Producto]
            });

            if (detalles.length === 0)
                return res.status(404).json({ error: 'No hay productos para esta compra' });

            res.json(detalles);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Actualizar un detalle de compra
    async actualizarDetalle(req, res) {
        try {
            const { id } = req.params;
            const { cantidad, precioUnitario } = req.body;

            const detalle = await CompraProducto.findByPk(id);
            if (!detalle) return res.status(404).json({ error: 'Detalle no encontrado' });

            const subtotal = (cantidad || detalle.cantidad) * (precioUnitario || detalle.precioUnitario);

            await detalle.update({
                cantidad: cantidad ?? detalle.cantidad,
                precioUnitario: precioUnitario ?? detalle.precioUnitario,
                subtotal
            });

            res.json({ mensaje: 'Detalle actualizado correctamente', detalle });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Eliminar un detalle de compra
    async eliminarDetalle(req, res) {
        try {
            const { id } = req.params;
            const deleted = await CompraProducto.destroy({ where: { id } });

            if (!deleted) return res.status(404).json({ error: 'Detalle no encontrado' });
            res.json({ mensaje: 'Detalle eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};
