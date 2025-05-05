const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get user's cart
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ cart: user.cart });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Server error while fetching cart' });
  }
});

// Add book to cart
router.post('/add', auth, async (req, res) => {
  const { book } = req.body || {};  // Get the book object from request body

  // Check if the book object is missing
  if (!book) {
    return res.status(400).json({ message: 'Book object missing in request body' });
  }

  try {
    // Find the user by ID
    const user = await User.findById(req.user.id);

    // Check if the book data is incomplete
    if (!book.bookId || !book.title || !book.price) {
      return res.status(400).json({ message: 'Book data is incomplete' });
    }

    // Add book to cart
    user.cart.push({
      bookId: book.bookId,
      title: book.title,
      author: book.author,
      coverImage: book.coverImage,
      price: book.price,
      quantity: 1,  // Set quantity to 1 initially
    });

    // Save the user with the updated cart
    await user.save();

    // Return success message with updated cart
    res.status(200).json({ message: 'Book added to cart successfully', cart: user.cart });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Server error while adding to cart' });
  }
});

// Update book quantity in cart
router.post('/update', auth, async (req, res) => {
  const { bookId, quantity } = req.body;

  if (!bookId || quantity <= 0) {
    return res.status(400).json({ message: 'Invalid bookId or quantity' });
  }

  try {
    const user = await User.findById(req.user.id);
    const item = user.cart.find(item => item.bookId.toString() === bookId.toString());

    if (!item) {
      return res.status(404).json({ message: 'Book not found in cart' });
    }

    item.quantity = quantity;  // Update quantity
    await user.save();

    res.status(200).json({ message: 'Cart updated', cart: user.cart });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ message: 'Server error while updating cart' });
  }
});

// Remove book from cart
router.post('/remove', auth, async (req, res) => {
  const { bookId } = req.body;

  if (!bookId) {
    return res.status(400).json({ message: 'bookId is required' });
  }

  try {
    const user = await User.findById(req.user.id);

    // Find and remove the book from cart
    user.cart = user.cart.filter(item => item.bookId.toString() !== bookId.toString());

    await user.save();

    res.status(200).json({ message: 'Book removed from cart', cart: user.cart });
  } catch (error) {
    console.error('Error removing book from cart:', error);
    res.status(500).json({ message: 'Server error while removing book from cart' });
  }
});

module.exports = router;
