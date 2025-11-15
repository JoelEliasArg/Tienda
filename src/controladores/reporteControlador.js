const { Compra, Producto, Cliente, Proveedor, CompraProducto } = require('../baseDatos');
const { Op } = require('sequelize');
const sequelize = require('sequelize'); 

module.exports = {
    async ventasPorFecha(req, res) {
    try {
      const { fechaInicio, fechaFin } = req.query;
            
            // Si la columna de fecha no se llama 'fecha', sino 'createdAt', debes ajustar el campo:
            // where: { createdAt: { [Op.between]: [fechaInicio, fechaFin] } }
      const compras = await Compra.findAll({
        where: {
          fecha: { [Op.between]: [fechaInicio, fechaFin] }
        },
        include: [Cliente, Producto] // Incluye la asociación para obtener datos
      });
      res.json(compras);
    } catch (error) {
      console.error('Error en ventasPorFecha:', error);
      res.status(500).json({ error: error.message });
    }
  },

    async productosMasVendidos(req, res) {
        try {
            const productosVendidos = await CompraProducto.findAll({
                attributes: [
                    // Sumamos la cantidad de todos los CompraProducto
                    [sequelize.fn('SUM', sequelize.col('cantidad')), 'totalUnidadesVendidas']
                ],
                // Agrupamos por producto para sumar sus ventas individuales
                group: ['productoId', 'Producto.id', 'Producto.nombre'], 
                include: [
                    {
                        model: Producto, 
                        attributes: ['nombre'] 
                    }
                ],
                order: [
                    [sequelize.col('totalUnidadesVendidas'), 'DESC'] 
                ],
                limit: 10
            });

            const reporte = productosVendidos.map(item => ({
                producto: item.Producto.nombre,
                totalUnidadesVendidas: item.get('totalUnidadesVendidas')
            }));

            res.json(reporte);

        } catch (error) {
            console.error('Error en productosMasVendidos:', error);
            res.status(500).json({ error: 'Error al obtener el reporte de más vendidos.' });
        }
    },

    async proveedoresConMasProductos(req, res) {
        try {
            // Este reporte muestra proveedores con mayor inventario (productos registrados)
            const proveedores = await Proveedor.findAll({
                include: [{ model: Producto }],
                order: [['nombre', 'ASC']]
            });
            res.json(proveedores);
        } catch (error) {
            console.error('Error en proveedoresConMasProductos:', error);
            res.status(500).json({ error: error.message });
        }
    }
};