const defineCompra = (sequelize, DataTypes) => {
    return sequelize.define('Compra', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        clienteId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        total: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'compras',
        timestamps: true
    });
};

module.exports = defineCompra;
