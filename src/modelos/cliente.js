const defineCliente = (sequelize, DataTypes) => {
    return sequelize.define('Cliente', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        telefono: {
            type: DataTypes.STRING,
            allowNull: true
        },
        direccion: {
            type: DataTypes.STRING,
            allowNull: true
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true // Soft Delete
        }
    }, {
        tableName: 'clientes',
        timestamps: true
    });
};

module.exports = defineCliente;
