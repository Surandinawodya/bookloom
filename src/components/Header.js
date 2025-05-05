import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import './Header.css';
import {
  FaPhone, FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter,
  FaSearch, FaUser, FaShoppingCart, FaHeart, FaEnvelope, FaBars, FaTimes
} from 'react-icons/fa';
import img from '../assets/img.png';

const Header = () => {
  const { cartItems } = useContext(CartContext);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header-top">
      <div className="top-bar">
        <div className="top-bar-left">
          <FaPhone /> +94 452265984 | 
          <a href="mailto:support@bookloom.com" className="email-link">
            <FaEnvelope /> support@bookloom.com
          </a>
        </div>
        <div className="top-bar-right desktop-only">
          <Link to="/Register" className="social-icon">Sign Up</Link>
          <Link to="/login" className="social-icon">Login</Link>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon"><FaFacebookF /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon"><FaInstagram /></a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon"><FaLinkedinIn /></a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon"><FaTwitter /></a>
        </div>

        <button className="menu-toggle mobile-only" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <div className="main-header">
        <div className="logo-container">
          <img src={img} alt="BookLoom Logo" className="logo-image" />
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Search Books" />
          <button type="submit"><FaSearch /></button>
        </div>
        <div className="header-actions desktop-only">
          <Link to="/MyProfilePage" className="action-item"><FaUser /> Account</Link>
          <Link to="/Cart" className="action-item"><FaShoppingCart /> Cart ({totalItems})</Link>
          <Link to="/WishList" className="action-item"><FaHeart /> Wishlist</Link>
        </div>
      </div>

      <nav className="main-navigation desktop-only">
        <ul className="nav-links">
          <li><Link to="/Homepage" className="active">Home</Link></li>
          <li><Link to="/About">About Us</Link></li>
          <li><Link to="/BookList">Books</Link></li>
          <li><Link to="/ContactUs">Contact Us</Link></li>
        </ul>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <div className="mobile-header-actions">
            <Link to="/MyProfilePage" className="action-item"><FaUser /> Account</Link>
            <Link to="/Cart" className="action-item"><FaShoppingCart /> Cart ({totalItems})</Link>
            <Link to="/WishList" className="action-item"><FaHeart /> Wishlist</Link>
          </div>

          <ul className="nav-links-mobile">
            <li><Link to="/Homepage">Home</Link></li>
            <li><Link to="/About">About Us</Link></li>
            <li><Link to="/BookList">Books</Link></li>
            <li><Link to="/ContactUs">Contact Us</Link></li>
          </ul>

          <div className="top-bar-right mobile-only">
            <Link to="/Register" className="social-icon">Sign Up</Link>
            <Link to="/login" className="social-icon">Login</Link>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon"><FaFacebookF /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon"><FaInstagram /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon"><FaLinkedinIn /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon"><FaTwitter /></a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
