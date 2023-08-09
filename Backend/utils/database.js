const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('expense-tracker', 'root', 'password', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;