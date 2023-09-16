const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const sequelize = require('./utils/database');
const dotenv = require('dotenv');
dotenv.config();    // To use env file variables
const port = process.env.PORT;
const app = express();

// Set the view engine to EJS. Configures Express to use the EJS template engine for rendering views
app.set('view engine', 'ejs');
app.set('views', 'views');  // Shows where ejs templates are located

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const leaderboardRoutes = require('./routes/leaderboard');
const resetPasswordRoutes = require('./routes/resetpassword');
const reportRoutes = require('./routes/report');
const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/order');
const ForgotPasswordRequest = require('./models/forgotpasswordrequest');

// Relation b/w user and expense models
User.hasMany(Expense);
Expense.belongsTo(User);

// Relation b/w user and order models
User.hasMany(Order);
Order.belongsTo(User);

// Relation b/w user and forgotpasswordrequest
User.hasMany(ForgotPasswordRequest);
ForgotPasswordRequest.belongsTo(User);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', leaderboardRoutes);
app.use('/password', resetPasswordRoutes);
app.use('/report', reportRoutes);

sequelize.sync()
.then(() => {
    console.log(`Server is starting at ${port}`);
    app.listen(port || 3000);
})
.catch(err => {
    console.log(err);
})