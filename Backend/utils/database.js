const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();    // To use env file variables

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
    dialect: 'mysql',
    host: process.env.HOST
});

module.exports = sequelize;