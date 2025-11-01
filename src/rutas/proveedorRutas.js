const express = require('express');
const enrutador = express.Router();
const proveedorControlador = require('../controladores/proveedorControlador');

enrutador.post('/', proveedorControlador.crearProveedor);
enrutador.get('/', proveedorControlador.obtenerProveedores);
enrutador.get('/:id', proveedorControlador.obtenerProveedorPorId);
enrutador.put('/:id', proveedorControlador.actualizarProveedor);
enrutador.delete('/:id', proveedorControlador.eliminarProveedor);

module.exports = enrutador;
