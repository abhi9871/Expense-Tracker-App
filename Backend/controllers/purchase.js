const Razorpay = require('razorpay');
const Order = require('../models/order');
const userController = require('../controllers/user');
const dotEnv = require('dotenv').config();

// Buy premium function
exports.purchasePremium = (req, res) => {
    const rzp = new Razorpay( {
        key_id: process.env.RAZOR_KEY_ID,
        key_secret: process.env.RAZOR_SECRET_KEY
    });

    const options = {
        amount: 2500,
        currency: 'INR',
    }

    try {
        rzp.orders.create(options, (err, order) => {
            if(err) {
                console.log(err);
                return res.status(400).json({ success: false, message: err.message });
            }
            return res.status(201).json({ success: true, data: { order, key_id: rzp.key_id} });         
        }) 
    } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false, message: err.message });
    }
};

// Update transaction status function
exports.updateTransactionStatus = async (req, res) => {
    try {
        const { paymentId, orderId, isPaymentFailed } = req.body;
        let status = (isPaymentFailed) ? 'failed' : 'successful';
        const order = await req.user.createOrder({ orderId, paymentId, status});
        if(order) {
            if(status === 'successful') {
                await req.user.update({ isPremiumUser: true });
                // Update a jwt token after buying premium
                const userId = req.user.id;
                const userName = req.user.name;
                const isPremiumUser = req.user.isPremiumUser;
                const token = userController.generateToken(userId, userName, isPremiumUser);
                res.status(200).json({ success: true, message: 'Transaction successful', token: token });
            }
            else {
                res.status(404).json({ success: false, message: 'Transaction failed' });
            }          
        }
        else {
            res.status(404).json({ success: false, message: 'No order found' });
        }
    } catch(err) {
        console.log(err.message);
        res.status(400).json({ success: false, message: err.message });
    }
};
