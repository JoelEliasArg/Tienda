const express = require('express');
const enrutador = express.Router();
const compraControlador = require('../controladores/compraControlador');

enrutador.post('/', compraControlador.crearCompra);
enrutador.get('/', compraControlador.obtenerCompras);
enrutador.get('/:id', compraControlador.obtenerCompraPorId);

module.exports = enrutador;
