const User = require('../models/user');
const sequelize = require('../utils/database');

exports.getLeaderBoard = async (req, res) => {
    try {
      const usersWithExpenses = await User.findAll({
        attributes: [
          'name', // Include the 'name' column in the attributes
          'totalExpenses'
        ],
        order: [['totalExpenses', 'DESC']], // Order by 'TotalExpenses' in descending order
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
  