const express = require('express');
const enrutador = express.Router();
const reporteControlador = require('../controladores/reporteControlador');

enrutador.get('/ventas', reporteControlador.ventasPorFecha);
enrutador.get('/productos-mas-vendidos', reporteControlador.productosMasVendidos);
enrutador.get('/proveedores', reporteControlador.proveedoresConMasProductos);

module.exports = enrutador;
