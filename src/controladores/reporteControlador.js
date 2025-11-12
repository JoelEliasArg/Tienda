// Asegúrate de tener la instancia de Sequelize disponible.
// Si no la tienes disponible globalmente, debes importarla.
// Asumo que tu baseDatos.js devuelve la conexión. Aquí la importamos como paquete:
const sequelize = require('sequelize'); 

const { Compra, Producto, Cliente, Proveedor, CompraProducto } = require('../baseDatos');
const { Op } = require('sequelize');

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


  async proveedoresConMasProductos(req, res) {
    try {
      // Esta consulta ya es eficiente, solo pide los proveedores e incluye sus productos
      const proveedores = await Proveedor.findAll({
        include: [{ model: Producto }],
                // Ordenar por la cantidad de productos en el frontend es más limpio
        order: [['nombre', 'ASC']] // Ordenamos por nombre para consistencia
      });
      res.json(proveedores);
    } catch (error) {
      console.error('Error en proveedoresConMasProductos:', error);
      res.status(500).json({ error: error.message });
    }
  }
};