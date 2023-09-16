const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Expense = sequelize.define('expense', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: new Date().toISOString().slice(0, 10),
    },
    category: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    amount: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    }
})

module.exports = Expense;