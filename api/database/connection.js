const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
});

const dbConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection successfull.')
    } catch (error) {
        console.log('Error connecting to the database:', error)
    }
}

module.exports = { sequelize, dbConnection };