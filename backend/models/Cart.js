const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// GET /api/cart - Get user's cart
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ cart: user.cart });
  } catch (err) {
    console.error('Failed to fetch cart:', err);
    res.status(500).json({ message: 'Server error while fetching cart' });
  }
});

// POST /api/cart/add - Add a book to the cart
router.post('/add', auth, async (req, res) => {
  const { book } = req.body || {};
  if (!book || !book.bookId || !book.title || !book.price) {
    return res.status(400).json({ message: 'Book data is incomplete' });
  }

  try {
    const user = await User.findById(req.user.id);

    const existingItem = user.cart.find(item => item.bookId === book.bookId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cart.push({
        bookId: book.bookId,
        title: book.title,
        author: book.author,
        coverImage: book.coverImage,
        price: book.price,
        quantity: 1,
      });
    }

    await user.save();
    res.status(200).json({ message: 'Book added to cart', cart: user.cart });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Server error while adding to cart' });
  }
});

// POST /api/cart/update - Update book quantity
router.post('/update', auth, async (req, res) => {
  const { bookId, quantity } = req.body;
  if (!bookId || quantity < 1) {
    return res.status(400).json({ message: 'Invalid data for update' });
  }

  try {
    const user = await User.findById(req.user.id);
    const item = user.cart.find(item => item.bookId === bookId);

    if (!item) return res.status(404).json({ message: 'Book not found in cart' });

    item.quantity = quantity;
    await user.save();
    res.status(200).json({ message: 'Cart updated', cart: user.cart });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ message: 'Server error while updating cart' });
  }
});

// POST /api/cart/remove - Remove a book from the cart
router.post('/remove', auth, async (req, res) => {
  const { bookId } = req.body;
  if (!bookId) return res.status(400).json({ message: 'bookId required' });

  try {
    const user = await User.findById(req.user.id);
    user.cart = user.cart.filter(item => item.bookId !== bookId);
    await user.save();
    res.status(200).json({ message: 'Book removed', cart: user.cart });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Server error while removing from cart' });
  }
});

module.exports = router;
