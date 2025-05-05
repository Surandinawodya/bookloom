const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String},
  phoneNumber: { type: String},
  address: { type: String},
  cart: [
    {
      bookId: { type: String, required: true },
      title: { type: String, required: true },
      author: { type: String },
      coverImage: { type: String },
      price: { type: Number, required: true },
      quantity: { type: Number, default: 1 },
    },
    
  ],
});

const User = mongoose.model('User', userSchema);
module.exports = User;
