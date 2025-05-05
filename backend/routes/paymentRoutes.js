const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// Get all payments for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id }).populate('order');
    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: 'Server error while fetching payments' });
  }
});

// Get specific payment by order ID
router.get('/:orderId', auth, async (req, res) => {
  try {
    const payment = await Payment.findOne({ order: req.params.orderId }).populate('order');
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json(payment);
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ message: 'Server error while fetching payment' });
  }
});

module.exports = router;
