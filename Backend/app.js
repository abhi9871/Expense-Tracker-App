const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./utils/database');
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const leaderboardRoutes = require('./routes/leaderboard');
const resetPasswordRoutes = require('./routes/resetpassword');
const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/order');
const port = 5000;

const app = express();

// Relation b/w user and expense models
User.hasMany(Expense);
Expense.belongsTo(User);

// Relation b/w user and order models
User.hasMany(Order);
Order.belongsTo(User);

app.use(cors());
app.use(bodyParser.json());
app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', leaderboardRoutes);
app.use('/password', resetPasswordRoutes);

sequelize.sync()
.then(() => {
    console.log(`Server is starting at ${port}`);
    app.listen(port);
})
.catch(err => {
    console.log(err);
})