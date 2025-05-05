const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Payment = require('../models/Payment');
const auth = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');

router.post('/create', auth, async (req, res) => {
  try {
    const { cart, shippingDetails, paymentMethod, totalPrice } = req.body;

    if (!cart || !shippingDetails || !paymentMethod || !totalPrice) {
      return res.status(400).json({ message: 'Missing cart, shipping details, payment method, or total price' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate the total price from the cart if not provided
    const total = totalPrice || cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Create the invoice details
    const invoice = {
      orderNumber: uuidv4(),  // Generate a unique order number
      shippingAddress: shippingDetails.address,
      totalPrice: total,
      paymentMethod: paymentMethod,
      paymentStatus: 'pending',  // Default payment status
      invoiceDate: new Date()
    };

    const newOrder = new Order({
      user: user._id,
      shippingDetails,
      totalPrice: total,  // Include total price
      paymentMethod,
      paymentStatus: 'pending',  // Initial payment status
      status: 'pending',  // Initial order status
      invoice,  // Include the invoice object
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Server error while placing order', error: error.message });
  }
});

// Get all orders for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
});

// Get specific order by ID
router.get('/:orderId', auth, async (req, res) => {
  try {
    const orderId = mongoose.Types.ObjectId(req.params.orderId); // Convert to ObjectId
    const order = await Order.findOne({ _id: orderId, user: req.user.id }).populate('items.bookId', 'title author price');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server error while fetching order' });
  }
});

// Payment completion endpoint
router.post('/payment/complete', auth, async (req, res) => {
  try {
    const { orderId, paymentStatus, paymentAmount, paymentMethod } = req.body;

    if (!orderId || !paymentStatus || !paymentAmount || !paymentMethod) {
      return res.status(400).json({ message: 'Missing payment details' });
    }

    // Convert orderId to ObjectId
    let orderIdObject;
    try {
      orderIdObject = mongoose.Types.ObjectId(orderId);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid order ID format' });
    }

    // Find the order by ID
    const order = await Order.findOne({ _id: orderIdObject, user: req.user.id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Create a payment record
    const payment = new Payment({
      order: order._id,
      paymentMethod,
      paymentAmount
    });

    await payment.save();

    // Update the order payment status
    order.paymentStatus = paymentStatus;
    order.status = paymentStatus === 'completed' ? 'processing' : 'failed';
    await order.save();

    res.status(200).json({ message: 'Payment processed successfully', order, payment });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ message: 'Server error while processing payment' });
  }
});

module.exports = router;
