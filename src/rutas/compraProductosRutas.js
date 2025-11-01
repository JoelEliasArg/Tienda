const express = require('express');
const enrutador = express.Router();
const compraProductoControlador = require('../controladores/compraProductoControlador');

enrutador.post('/', compraProductoControlador.crearDetalle);
enrutador.get('/', compraProductoControlador.obtenerDetalles);
enrutador.get('/compra/:compraId', compraProductoControlador.obtenerDetallesPorCompra);
enrutador.put('/:id', compraProductoControlador.actualizarDetalle);
enrutador.delete('/:id', compraProductoControlador.eliminarDetalle);

module.exports = enrutador;
