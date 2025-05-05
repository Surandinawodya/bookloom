import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { CartContext } from '../contexts/CartContext';
import './Wishlist.css'; // Import the CSS file  <---- ADD THIS LINE

const Wishlist = () => {
  const { wishlist, removeFromWishlist, addToCart } = useContext(CartContext);

  return (
    <div className="wishlist-container">
      <Header />
      <h2>My Wishlist</h2>
      {wishlist && wishlist.length === 0 ? (
        <div className="wishlist-empty">
          <h2>Your Wishlist is Empty</h2>
          <p>Browse our books and add your favorites here!</p>
          <Link to="/booklist" className="continue-shopping">Continue Shopping</Link>
        </div>
      ) : (
        <ul className="wishlist-items">
          {wishlist && wishlist.map(item => (
            <li key={item.id} className="wishlist-item">
              <Link to={`/bookdetails/${item.id}`} className="item-link">
                <img src={item.coverImage} alt={item.title} className="item-image" />
                <div className="item-details">
                  <h3>{item.title}</h3>
                  <p className="item-author">By {item.author}</p>
                  <p className="item-price">${item.price}</p>
                </div>
              </Link>
              <div className="item-actions">
                <button className="add-to-cart-button" onClick={() => addToCart(item)}>
                  Add to Cart
                </button>
                <button className="remove-from-wishlist-button" onClick={() => removeFromWishlist(item.id)}>
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Wishlist;