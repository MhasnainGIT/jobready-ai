const User = require('../models/User');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.initiatePayment = async (req, res) => {
    const { planType } = req.body;
    const userId = req.user.id;

    const plans = {
        basic: { amount: 1000, currency: "INR" },   // ₹1000
        starter: { amount: 2000, currency: "INR" }, // ₹2000
        pro: { amount: 5000, currency: "INR" }      // ₹5000
    };

    if (!plans[planType]) {
        return res.status(400).json({ message: 'Invalid plan type' });
    }

    const options = {
        amount: plans[planType].amount * 100, // amount in the smallest currency unit
        currency: plans[planType].currency,
        receipt: `receipt_order_${new Date().getTime()}`,
        notes: {
            userId,
            planType
        }
    };

    try {
        const order = await instance.orders.create(options);
        if (!order) {
            return res.status(500).send("Error creating order");
        }
        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.verifyPayment = async (req, res) => {
    const { order_id, payment_id, signature, planType } = req.body;
    const userId = req.user.id;

    const plans = {
        basic: { credits: 50 },
        starter: { credits: 120 },
        pro: { credits: 300 }
    };

    const body = order_id + "|" + payment_id;

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === signature) {
        // Payment is successful
        try {
            const user = await User.findById(userId);
            user.credits += plans[planType].credits;
            user.plan = planType;
            await user.save();

            res.json({ 
                message: "Payment successful",
                credits: user.credits,
                plan: user.plan
            });

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    } else {
        res.status(400).json({ message: 'Payment verification failed' });
    }
}; 