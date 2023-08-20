const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./utils/database');
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const User = require('./models/user');
const Expense = require('./models/expense');
const port = 5000;

const app = express();

User.hasMany(Expense);
Expense.belongsTo(User);

app.use(cors());
app.use(bodyParser.json());
app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);

sequelize.sync()
.then(() => {
    console.log(`Server is starting at ${port}`);
    app.listen(port);
})
.catch(err => {
    console.log(err);
})