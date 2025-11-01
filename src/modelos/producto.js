// Archivo: modelos/producto.js

const defineProducto = (sequelize, DataTypes) => {
    return sequelize.define('Producto', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: true
        },
        precio: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: { min: 0 }
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { min: 0 }
        },
        proveedorId: {               // ✅ Nueva columna para relación con Proveedor
            type: DataTypes.INTEGER,
            allowNull: true
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'productos',
        timestamps: true
    });
};

module.exports = defineProducto;
