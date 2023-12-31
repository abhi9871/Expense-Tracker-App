const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: 'Please enter a valid email address' // Custom error message
            }
        }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [8, 100], // Password length should be between 8 and 100 characters
                msg: 'Password must be atleast 8 characters long' // Custom error message
            }
        }
    },
    totalExpenses: {
        type: Sequelize.DOUBLE,
        defaultValue: 0
    },
    isPremiumUser: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
})

module.exports = User;