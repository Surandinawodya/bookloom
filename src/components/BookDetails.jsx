import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header'; // Ensure the path is correct
import './BookDetails.css';
import { FaArrowLeft } from 'react-icons/fa';

const BookDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { book } = location.state || {}; // Retrieve the book details from state

  if (!book) {
    return <div className="book-details-container"><p>Book details not available.</p></div>;
  }

  // Function to generate a description if not provided
  const generateDescription = (book) => {
    if (book.description) return book.description;

    const title = book.title || 'This book';
    const author = book.author || 'an unknown author';
    const genre = book.genre || 'literature'; // You can update this if genre is available

    return `${title} is an engaging work by ${author}. Perfect for readers interested in ${genre}.`;
  };

  const description = generateDescription(book);

  // Stock availability is not available from Open Library API, so assume a random stock
  const stockAvailability = Math.floor(Math.random() * 10); // Random stock for demo

  return (
    <div>
      {/* Header Section */}
      <Header />

      <div className="book-details-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>

        <div className="book-details-card">
          <img src={book.coverImage} alt={book.title} className="details-cover" />
          <div className="details-info">
            <h2>{book.title}</h2>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Price:</strong> ${book.price}</p>
            <p><strong>ID:</strong> {book.key}</p>
            <p><strong>Description:</strong> {description}</p>
            <p><strong>Stock Availability:</strong> {stockAvailability} available</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
