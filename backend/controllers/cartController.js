const Cart = require('../models/Cart');

exports.getCart = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id });
  res.json({ cart: cart?.items || [] });
};

exports.addToCart = async (req, res) => {
  const { book } = req.body;
  let cart = await Cart.findOne({ userId: req.user.id });

  if (!cart) {
    cart = new Cart({ userId: req.user.id, items: [book] });
  } else {
    const existingItem = cart.items.find(item => item.bookId === book.bookId);
    if (existingItem) {
      existingItem.quantity += book.quantity || 1;
    } else {
      cart.items.push(book);
    }
  }

  await cart.save();
  res.json({ cart: cart.items });
};

exports.removeFromCart = async (req, res) => {
  const { bookId } = req.body;
  const cart = await Cart.findOne({ userId: req.user.id });

  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  cart.items = cart.items.filter(item => item.bookId !== bookId);
  await cart.save();
  res.json({ cart: cart.items });
};

exports.updateQuantity = async (req, res) => {
  const { bookId, quantity } = req.body;
  const cart = await Cart.findOne({ userId: req.user.id });

  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  const item = cart.items.find(item => item.bookId === bookId);
  if (item) {
    item.quantity = Math.max(1, quantity); // prevent quantity < 1
  }

  await cart.save();
  res.json({ cart: cart.items });
};
