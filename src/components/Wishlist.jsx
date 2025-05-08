import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import './Wishlist.css';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const navigate = useNavigate();

  // Fetch wishlist data from the backend
  const fetchWishlist = async () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:5000/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log('Fetched Wishlist Data:', data);

      // Ensure wishlist is always an array, even if data.wishlist is undefined or null
      setWishlistItems(data.wishlist || []);
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // Handle remove item from wishlist
  const handleRemove = async (bookId) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:5000/api/wishlist/remove', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bookId })
      });

      if (response.ok) {
        const data = await response.json();
        setWishlistItems(data.wishlist || []); // Ensure wishlist is updated to an array
      }
    } catch (err) {
      console.error('Failed to remove item:', err);
    }
  };

  return (
    <>
      <Header />
      <div className="steps">
        <div className="step active">1 <span>WISHLIST</span></div>
        <div className="step">2 <span>CHECKOUT</span></div>
        <div className="step">3 <span>PAYMENT</span></div>
        <div className="step">4 <span>CONFIRMATION</span></div>
      </div>

      {wishlistItems.length === 0 ? (
        <p className="empty-wishlist">Your wishlist is empty.</p>
      ) : (
        <>
          <table className="wishlist-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {wishlistItems.map(item => (
                <tr key={item.bookId}>
                  <td className="item-details">
                    <img src={item.coverImage} alt={item.title} />
                    <span>{item.title}</span>
                  </td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>
                  <button className="remove-button" onClick={() => handleRemove(item.bookId)}>Remove</button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="wishlist-footer">
            <div className="continue-shopping" onClick={() => navigate('/')}>Continue Shopping &gt;&gt;</div>
            <div className="wishlist-summary">
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

export default Wishlist;
