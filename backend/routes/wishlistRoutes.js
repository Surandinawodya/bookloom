// routes/wishlistRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// GET /api/wishlist - Get user's wishlist
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ wishlist: user.wishlist || [] });
  } catch (err) {
    console.error('Failed to fetch wishlist:', err);
    res.status(500).json({ message: 'Server error while fetching wishlist' });
  }
});

// POST /api/wishlist/add - Add a book to wishlist
router.post('/add', auth, async (req, res) => {
  const { book } = req.body;
  if (!book || !book.bookId || !book.title || !book.price) {
    return res.status(400).json({ message: 'Book data is incomplete' });
  }

  try {
    const user = await User.findById(req.user.id);
    const alreadyInWishlist = user.wishlist.some(item => item.bookId === book.bookId);

    if (alreadyInWishlist) {
      return res.status(409).json({ message: 'Book already in wishlist' });
    }

    user.wishlist.push({
      bookId: book.bookId,
      title: book.title,
      author: book.author,
      coverImage: book.coverImage,
      price: book.price,
    });

    await user.save();
    res.status(200).json({ message: 'Book added to wishlist', wishlist: user.wishlist });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ message: 'Server error while adding to wishlist' });
  }
});

// POST /api/wishlist/remove - Remove a book from wishlist
router.post('/remove', auth, async (req, res) => {
  const { bookId } = req.body;
  if (!bookId) return res.status(400).json({ message: 'bookId required' });

  try {
    const user = await User.findById(req.user.id);
    user.wishlist = user.wishlist.filter(item => item.bookId !== bookId);
    await user.save();
    res.status(200).json({ message: 'Book removed from wishlist', wishlist: user.wishlist });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ message: 'Server error while removing from wishlist' });
  }
});

module.exports = router;
