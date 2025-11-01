const defineCompraProducto = (sequelize, DataTypes) => {
    return sequelize.define('CompraProducto', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        compraId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        productoId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1
            }
        },
        precioUnitario: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        subtotal: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                min: 0
            }
        }
    }, {
        tableName: 'compra_producto',
        timestamps: true
    });
};

module.exports = defineCompraProducto;
