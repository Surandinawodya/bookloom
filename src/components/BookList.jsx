import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import './BookList.css';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';

const BookList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchBooks = async (query) => {
    setLoading(true);
    try {
      const response = await fetch(`https://openlibrary.org/search.json?q=${query}`);
      const data = await response.json();
      const processedBooks = data.docs.slice(0, 20).map(book => ({
        id: book.key.replace('/works/', ''),
        title: book.title,
        author: book.author_name?.[0] || 'Unknown',
        coverImage: book.cover_i
          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
          : 'https://via.placeholder.com/150x200?text=No+Cover',
        price: parseFloat((Math.random() * 30 + 5).toFixed(2))
      }));
      setBooks(processedBooks);
    } catch (err) {
      console.error('Failed to fetch books:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const query = searchTerm.trim() || 'bestsellers'; // Default query
      fetchBooks(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleViewDetails = (book) => {
    navigate(`/bookdetails/${book.id}`, { state: { book } });
  };

  const handleAddToWishlist = async (book) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  
    if (!token) {
      alert('Please log in to add books to your wishlist.');
      navigate('/login');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/wishlist/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          book: {
            bookId: book.id,
            title: book.title,
            author: book.author,
            price: book.price,
            coverImage: book.coverImage
          }
        })
      });
  
      if (response.ok) {
        alert(`"${book.title}" added to wishlist!`);
      } else {
        const errorData = await response.json();
        alert(errorData.message || `Failed to add book to wishlist (status: ${response.status})`);
      }
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      alert('An error occurred while adding to wishlist.');
    }
  };
  

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
            bookId: book.id,
            title: book.title,
            author: book.author,
            price: book.price,
            coverImage: book.coverImage
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert(`"${book.title}" added to cart!`);
      } else {
        const errorData = await response.json();
        alert(errorData.message || `Failed to add book to cart (status: ${response.status})`);
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('An error occurred while adding to cart.');
    }
  };
  

  return (
    <div>
      <Header />
      <div className="book-list-container">
        <div className="search-filter-bar">
          <input
            type="text"
            placeholder="Search by title, author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {loading ? (
          <p>Loading books...</p>
        ) : books.length === 0 ? (
          <p>No books found.</p>
        ) : (
          <div className="book-grid">
            {books.map((book) => (
              <div
                key={book.id}
                className="book-card"
                onClick={() => handleViewDetails(book)}
              >
                <img src={book.coverImage} alt={book.title} className="book-image" />
                <div className="book-actions">
                  <button
                    className="wishlist-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToWishlist(book);
                    }}
                  >
                    <FaHeart />
                  </button>
                  <button
                    className="cart-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(book);
                    }}
                  >
                    <FaShoppingCart />
                  </button>
                </div>
                <h3>{book.title}</h3>
                <p>{book.author}</p>
                <p className="book-price">${book.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookList;
