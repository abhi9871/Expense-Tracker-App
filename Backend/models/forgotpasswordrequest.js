const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');

const ForgotPasswordRequests = sequelize.define('forgotpasswordrequest', {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    }
});

module.exports = ForgotPasswordRequests;
