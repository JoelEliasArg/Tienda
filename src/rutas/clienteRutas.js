const express = require('express');
const enrutador = express.Router();
const clienteControlador = require('../controladores/clienteControlador');

enrutador.post('/', clienteControlador.crearCliente);
enrutador.get('/:id', clienteControlador.obtenerClientePorId);
enrutador.put('/:id', clienteControlador.actualizarCliente);
router.get('/', clienteControlador.listarClientes);

module.exports = enrutador;
