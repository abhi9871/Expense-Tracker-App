const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv').config();

exports.createUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    if (password.length < 8) {
      return res.status(400).json({success: false, errors: { password: "Password must be atleast 8 characters long" } });
    }
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    const user = await User.create({
      name: name,
      email: email,
      password: hash,
    });
    res.status(200).json({ success: true, message: "Sign up successful." });
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      const validationErrors = {};
      err.errors.forEach((error) => {
        validationErrors[error.path] = error.message;
      });
      res.status(400).json({ success: false, errors: validationErrors });
    } else if (err.name === "SequelizeUniqueConstraintError") {
      res.status(400).json({success: false, errors: { email: "Email already exists" },
      });
    } else {
      console.log(err);
      res.status(500).json({ success: false, message: "Internal server error." });
    }
  }
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (user) {
        // Generate a jwt token to encrypt user id
        const userId = user.id;
        const userName = user.name;
        const secretKey = process.env.SECRET_KEY;
        const token = jwt.sign({id: userId, name: userName}, secretKey);

        const result = await bcrypt.compare(password, user.password);
        if(result){
            res.status(200).json({ success: true, token: token });
        }
        else {
            res.status(401).json({ success: false, message: "User not authorized" });
        }
    } else {
        res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (err) {
        res.status(500).json({ success: false, message: "An error occurred" });
  }
};
