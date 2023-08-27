const User = require('../models/user');
const Expense = require('../models/expense');
const sequelize = require('../utils/database');

exports.getLeaderBoard = async (req, res) => {
    try {
      const usersWithExpenses = await User.findAll({
        attributes: [
          'name', // Include the 'name' column in the attributes
          [sequelize.fn('SUM', sequelize.col('expenses.amount')), 'totalExpenses'],
        ],
        include: [
          {
            model: Expense,
            attributes: [],
          },
        ],
        group: ['user.id'], // Group by both 'id' and 'name'
        order: [[sequelize.col('totalExpenses'), 'DESC']], // Order by 'TotalExpenses' in descending order
      });
  
      console.log(JSON.stringify(usersWithExpenses, null, 2));
      if(usersWithExpenses){
        res.status(200).json({ success: true, usersWithExpenses });
      } else {
        res.status(400).json({ success: false, message: 'Error while fetching the leaderboard data' });
      }

    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, message: 'Something went wrong' });
      throw error;
    }
  };
  