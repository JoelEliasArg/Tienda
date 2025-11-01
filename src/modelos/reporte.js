const defineReporte = (sequelize, DataTypes) => {
    return sequelize.define('Reporte', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        tipo: {
            type: DataTypes.STRING, // Ej: "ganancias", "productos_mas_vendidos"
            allowNull: false
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: true
        },
        fechaInicio: {
            type: DataTypes.DATE,
            allowNull: true
        },
        fechaFin: {
            type: DataTypes.DATE,
            allowNull: true
        },
        resultado: {
            type: DataTypes.JSON, // Permite guardar listas o totales
            allowNull: true
        }
    }, {
        tableName: 'reportes',
        timestamps: true
    });
};

module.exports = defineReporte;
