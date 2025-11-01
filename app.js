require('dotenv').config();
const express = require('express');
const cors = require('cors');

// --- 1. Importar conexión y modelos ---
const { sequelize } = require('./baseDatos'); 

// --- 2. Importar controladores ---
const clienteControlador = require('./controladores/clienteControlador');
const productoControlador = require('./controladores/productoControlador');
const proveedorControlador = require('./controladores/proveedorControlador');
const compraControlador = require('./controladores/compraControlador');
const compraProductoControlador = require('./controladores/compraProductoControlador');
const reporteControlador = require('./controladores/reporteControlador');

// --- 3. Inicializar Express ---
const app = express();
app.use(cors());
app.use(express.json());

// --- 4. Definir rutas principales (similar al ejemplo Pokémon) ---

// 🧍 CLIENTES
app.post('/clientes', clienteControlador.crearCliente);
app.get('/clientes', clienteControlador.obtenerClientes);
app.get('/clientes/:id', clienteControlador.obtenerClientePorId);
app.put('/clientes/:id', clienteControlador.actualizarCliente);
app.delete('/clientes/:id', clienteControlador.eliminarCliente);

// 📦 PRODUCTOS
app.post('/productos', productoControlador.crearProducto);
app.get('/productos', productoControlador.obtenerProductos);
app.get('/productos/:id', productoControlador.obtenerProductoPorId);
app.put('/productos/:id', productoControlador.actualizarProducto);
app.delete('/productos/:id', productoControlador.eliminarProducto);

// 🏭 PROVEEDORES
app.post('/proveedores', proveedorControlador.crearProveedor);
app.get('/proveedores', proveedorControlador.obtenerProveedores);
app.get('/proveedores/:id', proveedorControlador.obtenerProveedorPorId);
app.put('/proveedores/:id', proveedorControlador.actualizarProveedor);
app.delete('/proveedores/:id', proveedorControlador.eliminarProveedor);

// 🧾 COMPRAS
app.post('/compras', compraControlador.crearCompra);
app.get('/compras', compraControlador.obtenerCompras);
app.get('/compras/:id', compraControlador.obtenerCompraPorId);

// 🛒 DETALLES DE COMPRA (CompraProducto)
app.post('/compra-productos', compraProductoControlador.crearDetalle);
app.get('/compra-productos', compraProductoControlador.obtenerDetalles);
app.get('/compra-productos/compra/:compraId', compraProductoControlador.obtenerDetallesPorCompra);
app.put('/compra-productos/:id', compraProductoControlador.actualizarDetalle);
app.delete('/compra-productos/:id', compraProductoControlador.eliminarDetalle);

// 📊 REPORTES
app.get('/reportes/ventas', reporteControlador.ventasPorFecha);
app.get('/reportes/productos-mas-vendidos', reporteControlador.productosMasVendidos);
app.get('/reportes/proveedores', reporteControlador.proveedoresConMasProductos);

// --- 5. Archivos estáticos (Frontend) ---
app.use(express.static('Frontend'));

// --- 6. Iniciar servidor ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);

  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos.');
    await sequelize.sync({ alter: true });
    console.log('✅ Sincronización completada.');
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
  }
});
