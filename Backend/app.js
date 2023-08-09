const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./utils/database');
const userRoutes = require('./routes/user');
const port = 5000;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/user', userRoutes);

sequelize.sync()
.then(() => {
    console.log(`Server is starting at ${port}`);
    app.listen(port);
})
.catch(err => {
    console.log(err);
})