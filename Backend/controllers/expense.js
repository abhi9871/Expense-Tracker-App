const Expense = require('../models/expense');

// Create an expense
exports.addExpense = async (req, res) => {
    const userId = req.user ? req.user.id : null;
    if (!userId) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    const { category, description, amount } = req.body;
    try {
        const expense = await Expense.create({
            category: category,
            description: description,
            amount: amount,
            userId: userId
        });
        res.status(200).json({ success: true, data: expense });
    } catch (err) {
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
    const expenseId = req.params.expenseId;
    try {
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
    const expenseId = req.params.expenseId;
    const { category, description, amount } = req.body;
    try {
        const expense = await Expense.findByPk(expenseId);

        // Check for authenticated user
        if(req.user.id === expense.userId){
            // Check if the expense exists or not
            if (!expense) {
                return res.status(404).json({ success: false, message: 'Expense not found' });
            }

            // Update the expense properties
            expense.category = category;
            expense.description = description;
            expense.amount = amount;

            // Save the updated expense
            const updatedExpense = await expense.save();
            res.status(200).json({ success: true, message: 'Expense has been updated', data: updatedExpense });
        } else {
            return res.status(401).json({ success: false, message: 'Unauthenticated user' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'An error occured while updating expense' });
    }
};

// Delete an expense by the expense id
exports.deleteExpenseById = async (req, res) => {
    const expenseId = req.params.expenseId;
    try {
        const expense = await Expense.findByPk(expenseId);

        // Check for authenticated user
        if(req.user.id === expense.userId){
            // Check if the expense exists or not
            if (!expense) {
                return res.status(404).json({ success: false, message: 'Expense not found' });
            }

            // Delete the expense
            const deletedExpense = await expense.destroy();
            res.status(200).json({ success: true, message: 'Expense has been deleted' });
        } else {
            return res.status(401).json({ success: false, message: 'Unauthenticated user' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'An error occured while deleting expense' });
    }
};