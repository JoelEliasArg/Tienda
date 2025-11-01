const express = require('express');
const enrutador = express.Router();
const productoControlador = require('../controladores/productoControlador');

enrutador.post('/', productoControlador.crearProducto);
enrutador.get('/', productoControlador.obtenerProductos);
enrutador.get('/:id', productoControlador.obtenerProductoPorId);
enrutador.put('/:id', productoControlador.actualizarProducto);
enrutador.delete('/:id', productoControlador.eliminarProducto);

module.exports = enrutador;
