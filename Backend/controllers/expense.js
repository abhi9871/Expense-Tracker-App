const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../utils/database');

// Helper function to initiate a transaction
async function startTransaction() {
    try {
      const t = await sequelize.transaction();
      return t;
    } catch (error) {
      // Handle any errors related to transaction initiation
      throw new Error('Error starting transaction: ' + error.message);
    }
  }

// Update the user's totalExpenses in the database
async function updateUserTotalExpenses(userId, amount, transaction) {
    try{
    const user = await User.findByPk(userId, { transaction });
    if (user) {
        user.totalExpenses += Number(amount);
        await user.save({ transaction }); // Save the updated user
    }
 } catch(err) {
    throw new Error('Error while updating the total expenses');
 }
}

// Create an expense with the transaction
exports.addExpense = async (req, res) => {
    try {
        let t; // Declare the transaction variable
        const userId = req.user ? req.user.id : null;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        const { category, description, amount } = req.body;

        // Start the transaction
        t = await startTransaction();
        const expense = await Expense.create({
            category: category,
            description: description,
            amount: amount,
            userId: userId
        }, { transaction: t });

        // Update user total expenses in the database as well with the same transaction
            await updateUserTotalExpenses(userId, amount, t);

        // Commit the transaction if everything is successful
            await t.commit();

            res.status(200).json({ success: true, data: expense });
    } catch (err) {
            // Rollback the transaction if an error occurs
            await t.rollback();
            console.log(err);
            res.status(500).json({ success: false, message: 'An error occured while creating expense' });
    }
};

// Get all the expenses for a particular user
exports.getExpenses = async (req, res) => {
    try {
       const expenses = await Expense.findAll({
        where: {
            userId: req.user.id
        }
       });
       res.status(200).json({ success: true, data: expenses });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'An error occurred while fetching expenses.' });
    }
};

// Get an expense details for a particular expense id
exports.getExpense = async (req, res) => {
    try {
        const expenseId = req.params.expenseId;
        const expense = await Expense.findByPk(expenseId);
        // Check for authenticated user
        if(req.user.id === expense.userId){
            if (!expense) {
                return res.status(404).json({ success: false, message: 'Expense not found' });
            }
            res.status(200).json({ success: true, data: expense });
        } else {
            return res.status(401).json({ success: false, message: 'Unauthenticated user' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'An error occurred while fetching expenses.' });
    }
}

// Update an expense by the expense id
exports.editExpenseById = async (req, res) => {
    try {
        let t; // Declare a transaction variable
        const expenseId = req.params.expenseId;
        const { category, description, amount } = req.body;

        // Start the transaction
        t = await startTransaction();
        const expense = await Expense.findByPk(expenseId, { transaction: t });

        // Check for authenticated user
        if(req.user.id === expense.userId){
            // Check if the expense exists or not
            if (!expense) {
                return res.status(404).json({ success: false, message: 'Expense not found' });
            }

           // Update user total expenses in the database as well with the same transaction
            let updatedAmount = amount - expense.amount;
            await updateUserTotalExpenses(expense.userId, updatedAmount, t);
            
            // Update the expense properties
            expense.category = category;
            expense.description = description;
            expense.amount = amount;

            // Save the updated expense
            const updatedExpense = await expense.save({ transaction: t });

            // Commit the transaction if everything is successful
            await t.commit();

            res.status(200).json({ success: true, message: 'Expense has been updated', data: updatedExpense });
        } else {
            // Rollback the transaction if an error occurs
            await t.rollback();
            return res.status(401).json({ success: false, message: 'Unauthenticated user' });
        }
    } catch (err) {
        // Rollback the transaction if an error occurs
        await t.rollback();
        console.log(err);
        res.status(500).json({ success: false, message: 'An error occured while updating expense' });
    }
};

// Delete an expense by the expense id
exports.deleteExpenseById = async (req, res) => {
    try {
        let t; // Declare a transaction variable
        const expenseId = req.params.expenseId;

        // Start the transaction
        t = await startTransaction();

        const expense = await Expense.findByPk(expenseId, { transaction: t });

        // Check for authenticated user
        if(req.user.id === expense.userId){
            // Check if the expense exists or not
            if (!expense) {
                return res.status(404).json({ success: false, message: 'Expense not found' });
            }
            
            // Update user total expenses in the database as well with the same transaction
            const amount = -expense.amount;
            await updateUserTotalExpenses(expense.userId, amount, t);

            // Delete the expense
            await expense.destroy({ transaction: t });

            // Commit the transaction if everything is successful
            await t.commit();

            res.status(200).json({ success: true, message: 'Expense has been deleted' });
        } else {
            // Rollback the transaction if an error occurs
            await t.rollback();
            return res.status(401).json({ success: false, message: 'Unauthenticated user' });
        }
    } catch (err) {
            // Rollback the transaction if an error occurs
            await t.rollback();
            console.log(err);
            res.status(500).json({ success: false, message: 'An error occured while deleting expense' });
    }
};