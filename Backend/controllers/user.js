const User = require('../models/user');

exports.createUser = async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
        const user = await User.create({
            name: name,
            email: email,
            password: password
        });
        res.status(200).json({ success: true, message: "Sign up successful." });
    } catch (err) {
        if (err.name === "SequelizeValidationError") {
            const validationErrors = {};
            err.errors.forEach(error => {
                validationErrors[error.path] = error.message;
        });
            res.status(400).json({ success: false, errors: validationErrors });
        }
        else {
            console.log(err);
            res.status(500).json({ success: false, message: "Internal server error." });
        }
    }
}