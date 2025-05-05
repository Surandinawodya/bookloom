import './Homepage.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import img3 from '../assets/img4.jpg';
import img11 from '../assets/img11.jpg';
import img22 from '../assets/img22.jpg';
import img33 from '../assets/img33.jpg';
import img44 from '../assets/img44.jpg';
import img6 from '../assets/img6.jpg';


const Homepage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://openlibrary.org/subjects/love.json?limit=12');
      const data = await response.json();
      const fetchedBooks = data.works.map((book) => ({
        key: book.key,
        title: book.title,
        author: book.authors?.[0]?.name || 'Unknown Author',
        coverImage: book.cover_id
          ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`
          : 'https://via.placeholder.com/150x200?text=No+Cover',
        price: (Math.random() * 30 + 5).toFixed(2),
      }));
      setBooks(fetchedBooks);
    } catch (err) {
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = () => {
    alert(`Searching for "${searchTerm}"`);
  };

  const handleBookClick = (book) => {
    navigate(`/bookdetails/${book.key.replace('/works/', '')}`, { state: { book } });
  };

  const handleAddToWishlist = (book) => {
    // Implement wishlist logic here
    alert(`Added ${book.title} to wishlist!`);
  };

 

  return (
    <div className="home-page">
      <Header />

      <section className="header">
        <div className="header-content">
          <h1 className="header-title">Discover Your Next Favorite Book</h1>
          <p className="header-description">
            Browse through thousands of titles, manage your collection, and shop with ease.
          </p>
          <button
            className="search-button"
            onClick={() => navigate('/booklist')}
          >
            Explore Books
          </button>
        </div>
        <img src={img3} className="header-img" alt="Books" />
      </section>

     

      <section className="book-list-section">
       
        {loading ? (
          <p>Loading books...</p>
        ) : filteredBooks.length === 0 ? (
          <p>No books found.</p>
        ) : (
          <div className="book-grid">
            {filteredBooks.map((book) => (
              <div key={book.key} className="book-card" onClick={() => handleBookClick(book)}>
                <img src={book.coverImage} alt={book.title} className="book-image" />
                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">{book.author}</p>
                  <p className="book-price">${book.price}</p>
                  <div className="book-actions">
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="featured-section">
        <div className="featured-content">
          <h2 className="featured-title">Featured Book: "Birds Gonna Be Happy"</h2>
          <p className="featured-description">
            Discover why readers are falling in love with this inspiring book.
          </p>
          <button
            className="search-button"
            onClick={() => navigate('/booklist')}
          >
            View Details
          </button>
        </div>
        <img src={img6} alt="Featured Book" className="header-img" />
      </section>

      <section className="special-offer">
        <h2 className="special-title">Special Offer: 50% Off!</h2>
        <p className="special-description">
          Grab your favorite books at half the price. Limited time only!
        </p>
        <button
          className="search-button"
          onClick={() => navigate('/booklist')}
        >
          Shop Now
        </button>
      </section>

      <section className="blog-section">
        <h2 className="featured-title" style={{ marginBottom: '2rem' }}>From Our Blog</h2>
        <div className="blog-grid">
          <div className="blog-card">
            <img src={img11}  alt="5 Books You Must Read" className="blog-image" />
            <h3 className="book-title">5 Books You Must Read Before They Hit the Big Screen</h3>
            <p className="book-author">A roundup of upcoming movies based on books and the novels behind them.</p>
          </div>
          <div className="blog-card">
            <img src={img22} alt="Self-Improvement Books" className="blog-image" />
            <h3 className="book-title">The Ultimate Reading List for Self-Improvement</h3>
            <p className="book-author">Curate a list of top books that inspire personal growth and productivity.</p>
          </div>
          <div className="blog-card">
            <img src= {img33} alt="Winter Reading List" className="blog-image" />
            <h3 className="book-title">Best Books for Cozy Winter Nights</h3>
            <p className="book-author">A seasonal list of warm, comforting books perfect for the winter season.</p>
          </div>
          <div className="blog-card">
            <img src={img44} alt="Fantasy Books" className="blog-image" />
            <h3 className="book-title">10 Must-Read Books for Fantasy Lovers</h3>
            <p className="book-author">Feature a collection of fantasy novels that immerse readers in magical worlds.</p>
          </div>
         
        </div>
      </section>

      <footer className="footer">
        &copy; 2025 BookLoom. All rights reserved.
      </footer>
    </div>
  );
};

export default Homepage;
