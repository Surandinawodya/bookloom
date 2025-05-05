import React, { useState } from 'react';
import Header from '../components/Header';
import './Contact.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [submissionStatus, setSubmissionStatus] = useState(null); // success or error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmissionStatus('success');
        setFormData({ name: '', email: '', message: '' }); // clear form
      } else {
        setSubmissionStatus('error');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmissionStatus('error');
    }
  };

  return (
    <>
      <Header />
      <div className="contact-container">
        <h2>Contact Us</h2>
        <p>If you have any questions or need assistance, feel free to reach out to us. We are here to help!</p>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea 
              name="message" 
              value={formData.message} 
              onChange={handleChange} 
              required 
            />
          </div>

          <button type="submit" className="submit-button">
            Send Message
          </button>
        </form>

        {submissionStatus === 'success' && (
          <p className="success-message">Thank you for reaching out! We will get back to you soon.</p>
        )}
        {submissionStatus === 'error' && (
          <p className="error-message">Something went wrong. Please try again later.</p>
        )}
      </div>
    </>
  );
};

export default ContactUs;
