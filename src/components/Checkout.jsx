import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import './Checkout.css'; // Make sure this exists and defines styling for `.steps` and `.step`

const Checkout = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required.';
    if (!formData.address) newErrors.address = 'Address is required.';
    if (!formData.city) newErrors.city = 'City is required.';
    if (!formData.postalCode) newErrors.postalCode = 'Postal code is required.';
    if (!formData.phone) newErrors.phone = 'Phone number is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateForm()) {
      return alert('Please fill out all the required fields.');
    }

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) return alert('Please login to place an order.');

    try {
      const cartResponse = await fetch('http://localhost:5000/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const cartData = await cartResponse.json();

      if (!cartResponse.ok || !Array.isArray(cartData.cart) || cartData.cart.length === 0) {
        return alert('Cart is empty or invalid.');
      }

      const response = await fetch('http://localhost:5000/api/order/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cart: cartData.cart,
          shippingDetails: formData,
          paymentMethod: "Cash on Delivery",
          totalPrice: cartData.cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
        })
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/PaymentConfirmation', {
          state: {
            orderNumber: data.orderId || '123456',
            shippingAddress: `${formData.address}, ${formData.city}`,
            totalPrice: data.totalPrice || 100.00
          }
        });
      } else {
        alert(data.message || 'Order placement failed.');
      }
    } catch (err) {
      console.error('Error placing order:', err);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
     <>
          <Header />
    <div className="checkout">
      

      {/* ✅ Steps Tracker */}
      <div className="steps">
        <div className="step active">1 <span>CART</span></div>
        <div className="step active">2 <span>CHECKOUT</span></div>
        <div className="step">3 <span>PAYMENT</span></div>
        <div className="step">4 <span>CONFIRMATION</span></div>
      </div>

      <h1>Checkout</h1>

      <div>
        
        {['name', 'address', 'city', 'postalCode', 'phone'].map((field) => (
          <div key={field}>
            <input
              type="text"
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={formData[field]}
              onChange={handleChange}
            />
            {errors[field] && <span className="error">{errors[field]}</span>}
          </div>
        ))}
      </div>

      <div className="actions">
        <button onClick={handleNext}>Place Order</button>
      </div>
    </div>
    </>
  );
};

export default Checkout;
