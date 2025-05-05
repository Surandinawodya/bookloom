const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  id: String,
  title: String,
  author: String,
  price: String,
  coverImage: String,
  description: String,
});

module.exports = mongoose.model('Book', bookSchema);
