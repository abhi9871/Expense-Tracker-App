const Brevo = require("@getbrevo/brevo");
const bcrypt = require('bcrypt');
const dotenv = require("dotenv");
const { v4: uuidv4 } = require('uuid');
const User = require("../models/user");
const ForgotPasswordRequest = require("../models/forgotpasswordrequest");

dotenv.config();    // To use env file variables

// Hashing the password function
const hashPassword = async (password, saltRounds) => {
  return await bcrypt.hash(password, saltRounds);
}

// Function to send reset link
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const requestId = uuidv4();
    const user = await User.findOne({ where: { email: email } });

    if(!user) {
        return res.status(404).json({ success: false, message: 'This email address does not exist. Please try with a valid email address' });
    }

    // Create a request id after the mail verified
      await ForgotPasswordRequest.create({
        id: requestId,
        userId: user.id
      })

      const client = Brevo.ApiClient.instance;
      const apiKey = client.authentications["api-key"];
      apiKey.apiKey = process.env.BREVO_KEY;
      const transEmailApi = new Brevo.TransactionalEmailsApi();
      const sender = {
        email: "abhishektomar0802@gmail.com",
        name: "Abhishek",
      };
      const receivers = [
        {
          email: email,
        },
      ];

      const response= await transEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: "Expense Tracker Reset Password",
        textContent: "Regain control of your financial journey! Reset your password and stay on top of your expenses with ease.",
        htmlContent: `<h3>Hi! We got the request from you to reset the password. Click the button below:</h3>
        <p><a href="http://localhost:5000/password/resetpassword/{{params.requestId}}" style="display: inline-block; background-color: #007BFF; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px;">Reset Password</a></p>`,
        params: {
          requestId: requestId,
        }
      });
      console.log(response);
      res.status(200).json({ success: true, message: 'An email containing the reset link has been sent to your email address' });
    
  } catch (err) {
    console.log(err);
    res.status(404).json({ success: false, message: "Something went wrong while sending the reset link" });
  }
};

// Function for resetting the password
exports.resetPassword = async (req, res) => {
    try {
        const requestId = req.params.requestId;
        const { updatedPassword } = req.body;
        const response = await ForgotPasswordRequest.findByPk(requestId);

        if(response.isActive) {   // Check whether the request id is active or not

            if (updatedPassword.length < 8) {   // Check for the password length
                return res.status(400).json({ success: false, errors: { password: "Password must be atleast 8 characters long" } });
            }

            const saltRounds = 10;
            const password = hashPassword(updatedPassword, saltRounds);
            const userId = response.userId;
            const updatedPasswordResponse = await User.update({ password: password }, { where: { id: userId } });

            if(updatedPasswordResponse) {
                await ForgotPasswordRequest.update({ isActive: 'false' }, { where: { id: response.id } });
                res.status(200).json({ success: true, message: "Your expense tracker app password has been successfully updated. You're all set to manage your finances securely." });
            }
            else {
              return res.status(404).json({ success: false, message: 'Failed to reset the password' });
            }
            
      } else {
          res.status(404).json({ success: false, message: 'This link is expired' });
      }
    } catch(err) {
        res.status(500).json({ message: 'Something went wrong' });
      console.log(err);
    }
}
