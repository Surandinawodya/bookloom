import React from 'react';
import Header from '../components/Header';
import './About.css';

const About = () => {
  return (
    <>
      <Header />
      <div className="about-container">
        <h2>About Bookloom</h2>
        <p>
          Welcome to Bookloom, your one-stop destination for all things books! At Bookloom, we aim to provide a seamless and enjoyable online shopping experience for book lovers around the world.
        </p>
        <p>
          We offer a vast collection of books in various genres, including fiction, non-fiction, academic, self-help, and more. Our platform allows readers to explore new books, find bestsellers, and discover hidden gems from both established and emerging authors.
        </p>
        <h3>Our Mission</h3>
        <p>
          Our mission is simple: to make books accessible to everyone, everywhere. We strive to deliver quality books at affordable prices, and provide a user-friendly experience to help you find your next favorite read with ease.
        </p>
        <h3>Why Choose Bookloom?</h3>
        <ul>
          <li>Wide range of books for all age groups and interests</li>
          <li>Secure and easy-to-use online shopping experience</li>
          <li>Fast and reliable delivery</li>
          <li>Great customer service to assist you every step of the way</li>
        </ul>
      </div>
    </>
  );
};

export default About;
