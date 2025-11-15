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
                    [sequelize.fn('SUM', sequelize.col('cantidad')), 'totalUnidadesVendidas']
                ],
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

    // --- 3. Proveedores con Mayor Inventario (CORREGIDO) ---
    async proveedoresConMasProductos(req, res) {
        try {
            // Hacemos una inclusión simple. El conteo se hará en el frontend.
            const proveedores = await Proveedor.findAll({
                // 🔑 CLAVE: Usamos el alias explícito 'Productos' para asegurar que Sequelize 
                // incluya el array bajo el nombre que espera el frontend.
                include: [{ model: Producto, as: 'Productos' }], 
                order: [['nombre', 'ASC']]
            });
            
            // Enviamos los datos al frontend. El frontend se encarga de calcular p.Productos.length y ordenar.
            res.json(proveedores);
        } catch (error) {
            console.error('Error en proveedoresConMasProductos:', error);
            // Si hay error, probablemente sea por la asociación
            res.status(500).json({ error: 'Fallo la consulta. Verifica Proveedor.hasMany(Producto, {as: "Productos"}) en tus modelos.' });
        }
    }
};