const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Users = sequelize.define('Users', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('admin', 'teacher', 'student'),
        defaultValue: 'student',
    },
}, {
    tableName: 'users',
    timestamps: true,
});


module.exports = Users;