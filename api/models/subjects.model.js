const { DataTypes, INTEGER } = require('sequelize');
const { sequelize } = require('../database/connection');

const Subjects = sequelize.define('Subjects', {
    subject_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    subject_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'subjects',
    timestamps: true,
});


module.exports = Subjects;