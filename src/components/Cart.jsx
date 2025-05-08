import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  // Fetch cart data from the backend
  const fetchCart = async () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:5000/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log('Fetched Cart Data:', data);

      // Ensure cart is always an array, even if data.cart is undefined or null
      setCartItems(data.cart || []);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Calculate total price whenever cartItems changes
  useEffect(() => {
    const calculatedTotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotal(calculatedTotal.toFixed(2));
  }, [cartItems]);

  // Handle quantity change
  const handleQuantityChange = async (bookId, newQty) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:5000/api/cart/update', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bookId, quantity: newQty })
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(data.cart || []); // Ensure cart is updated to an array
      }
    } catch (err) {
      console.error('Failed to update quantity:', err);
    }
  };

  // Handle remove item from cart
  const handleRemove = async (bookId) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:5000/api/cart/remove', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bookId })
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(data.cart || []); // Ensure cart is updated to an array
      }
    } catch (err) {
      console.error('Failed to remove item:', err);
    }
  };

  // Handle adding a book to the cart
  const handleAddToCart = async (book) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      alert('Please log in to add books to your cart.');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          book: {
            bookId: book.bookId,
            title: book.title,
            author: book.author,
            price: book.price,
            coverImage: book.coverImage
          }
        })
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Added to cart:', data.cart);
        alert(`"${book.title}" added to cart!`);
        setCartItems(data.cart || []); // Ensure cart is updated to an array
      } else {
        alert(data.message || 'Failed to add book to cart');
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('An error occurred while adding to cart.');
    }
  };

  return (
    <>
      <Header />
      <div className="steps">
        <div className="step active">1 <span>CART</span></div>
        <div className="step">2 <span>CHECKOUT</span></div>
        <div className="step">3 <span>PAYMENT</span></div>
        <div className="step">4 <span>CONFIRMATION</span></div>
      </div>

      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(item => (
                <tr key={item.bookId}>
                  <td className="item-details">
                    <img src={item.coverImage} alt={item.title} />
                    <span>{item.title}</span>
                  </td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>
                    <div className="quantity-controls">
                      <button onClick={() => handleQuantityChange(item.bookId, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleQuantityChange(item.bookId, item.quantity + 1)}>+</button>
                    </div>
                  </td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                  <button className="remove-button" onClick={() => handleRemove(item.bookId)}>Remove</button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-footer">
            <div className="continue-shopping" onClick={() => navigate('/')}>Continue Shopping &gt;&gt;</div>
            <div className="price-summary">
              <div className="price-row total">
                <strong>Total</strong>
                <strong>${total}</strong>
              </div>
              <button className="checkout-button" onClick={() => navigate('/Checkout')}>
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Cart;
