const Brevo = require("@getbrevo/brevo");
const User = require("../models/user");
require("dotenv").config();

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const responseEmail = await User.findOne({ where: { email: email } });

    if(!responseEmail) {
        return res.status(404).json({ success: false, message: 'This email address does not exist. Please try with a valid email address' });
    }

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
        textContent: "Link Below",
        htmlContent: `<h3>Hi! We got the request from you for reset the password. Here is the link below >>></h3>
                        <a href="#"> Click Here</a>`,
      });
      console.log(response);
      res.status(200).json({ success: true, message: 'An email containing the reset link has been sent to your email address' });
    
  } catch (err) {
    console.log(err);
    res.status(404).json({ success: false, message: "Something went wrong while sending the reset link" });
  }
};
