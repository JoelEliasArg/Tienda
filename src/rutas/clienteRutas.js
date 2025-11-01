const express = require('express');
const enrutador = express.Router();
const clienteControlador = require('../controladores/clienteControlador');

enrutador.post('/', clienteControlador.crearCliente);
enrutador.get('/', clienteControlador.obtenerClientes);
enrutador.get('/:id', clienteControlador.obtenerClientePorId);
enrutador.put('/:id', clienteControlador.actualizarCliente);
enrutador.delete('/:id', clienteControlador.eliminarCliente);

module.exports = enrutador;
