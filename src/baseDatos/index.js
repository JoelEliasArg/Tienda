require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

// --- 1. Importación de Modelos ---
const defineCliente = require('../modelos/cliente');
const defineProducto = require('../modelos/producto');
const defineProveedor = require('../modelos/proveedor');
const defineCompra = require('../modelos/compra');
const defineReporte = require('../modelos/reporte');
const defineCompraProducto = require('../modelos/compraProducto'); 

// --- 2. Configuración de la Conexión ---
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        port: process.env.DB_PORT || 3306,
        logging: false // Desactiva logs SQL en consola
    }
);

// --- 3. Definición de Modelos ---
const Cliente = defineCliente(sequelize, DataTypes);
const Producto = defineProducto(sequelize, DataTypes);
const Proveedor = defineProveedor(sequelize, DataTypes);
const Compra = defineCompra(sequelize, DataTypes);
const Reporte = defineReporte(sequelize, DataTypes);
const CompraProducto = defineCompraProducto(sequelize, DataTypes);

// --- 4. Definición de Asociaciones ---

/**
 * Relaciones principales de la App Tienda
 *
 * Cliente tiene muchas Compras
 * Compra pertenece a un Cliente
 * Compra puede tener muchos Productos (N:M)
 * Producto puede estar en muchas Compras (N:M)
 * Producto pertenece a un Proveedor
 * Proveedor tiene muchos Productos
 */

// Cliente <-> Compra (1:N)
Cliente.hasMany(Compra, { foreignKey: 'clienteId' });
Compra.belongsTo(Cliente, { foreignKey: 'clienteId' });

// Compra <-> Producto (N:M) usando tabla intermedia CompraProducto
Compra.belongsToMany(Producto, {
    through: CompraProducto,
    foreignKey: 'compraId',
    otherKey: 'productoId'
});
Producto.belongsToMany(Compra, {
    through: CompraProducto,
    foreignKey: 'productoId',
    otherKey: 'compraId'
});

// Proveedor <-> Producto (1:N)
Proveedor.hasMany(Producto, {
    foreignKey: 'proveedorId',
    onDelete: 'SET NULL', // Si se borra el proveedor, los productos no se eliminan
    onUpdate: 'CASCADE'
});
Producto.belongsTo(Proveedor, { foreignKey: 'proveedorId' });

// --- 5. Autenticación y Sincronización ---
sequelize.authenticate()
    .then(() => console.log('✅ Conectado a la base de datos.'))
    .catch(err => console.error('❌ Error al conectar a la base de datos:', err));

sequelize.sync({ alter: true, force: false })
    .then(() => console.log('✨ Sincronización completada.'))
    .catch(err => console.error('❌ Error en la sincronización:', err));

// --- 6. Exportación de Modelos y Sequelize ---
module.exports = {
    Cliente,
    Producto,
    Proveedor,
    Compra,
    Reporte,
    CompraProducto,
    sequelize
};
