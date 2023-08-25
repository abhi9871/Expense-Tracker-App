const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');

const Order = sequelize.define('order', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    orderId: Sequelize.STRING,
    paymentId: Sequelize.STRING,
    status: {
        type: Sequelize.ENUM('pending', 'successful', 'failed'),
        defaultValue: 'pending'
    }
})

module.exports = Order;