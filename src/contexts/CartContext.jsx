import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => setCartItems(res.data.cart))
        .catch(err => console.error('Failed to load cart:', err));
    }
  }, []);

  const addToCart = async (book) => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Please log in');
    try {
      const response = await axios.post('http://localhost:5000/api/cart/add', { book }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(response.data.cart);
    } catch (err) {
      console.error('Error adding book to cart:', err);
    }
  };

  const removeFromCart = async (bookId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://localhost:5000/api/cart/remove', { bookId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(response.data.cart);
    } catch (err) {
      console.error('Error removing book:', err);
    }
  };

  const updateQuantity = async (bookId, quantity) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://localhost:5000/api/cart/updateQuantity', { bookId, quantity }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(response.data.cart);
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};