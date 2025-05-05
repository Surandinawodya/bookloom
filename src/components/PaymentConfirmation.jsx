import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { jsPDF } from "jspdf";
import './PaymentConfirmation.css';

const PaymentConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const orderDetails = location.state || {
    orderNumber: 'N/A',
    shippingAddress: 'N/A',
    totalPrice: 0.00,
  };

  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentError, setPaymentError] = useState(null);

  const [expMonth, setExpMonth] = useState('');
  const [expYear, setExpYear] = useState('');

  const handleCompletePayment = async () => {
    if ((paymentMethod === 'creditCard' || paymentMethod === 'debitCard') && (!expMonth || !expYear)) {
      setPaymentError('Please select expiration month and year.');
      return;
    }

    try {
      const response = await simulatePaymentProcess(paymentMethod);
      if (response.success) {
        const statusUpdate = await updateOrderStatus(response.orderId, 'completed');
        if (statusUpdate.success) {
          setPaymentCompleted(true);
          setPaymentStatus('completed');
        } else {
          setPaymentError('Payment failed. Please try again.');
        }
      } else {
        setPaymentError('Payment failed. Please try again.');
      }
    } catch {
      setPaymentError('Error processing payment. Please try again later.');
    }
  };

  const simulatePaymentProcess = (method) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          orderId: orderDetails.orderNumber,
        });
      }, 2000);
    });
  };

  const updateOrderStatus = (orderId, status) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 1000);
    });
  };

  const generateInvoice = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Invoice", 20, 20);

    doc.setFontSize(12);
    doc.text(`Order Number: ${orderDetails.orderNumber}`, 20, 40);
    doc.text(`Shipping Address: ${orderDetails.shippingAddress}`, 20, 50);
    doc.text(`Total Price: $${orderDetails.totalPrice.toFixed(2)}`, 20, 60);

    const paymentLabel = paymentMethod === 'creditCard'
      ? 'Credit Card'
      : paymentMethod === 'debitCard'
      ? 'Debit Card'
      : 'PayPal';

    doc.text(`Payment Method: ${paymentLabel}`, 20, 70);
    doc.text(`Payment Status: ${paymentStatus}`, 20, 80);

    doc.save(`Invoice_${orderDetails.orderNumber}.pdf`);
  };

  return (
    <>
      <Header />
      <div className="steps">
        <div className="step active">1 <span>CART</span></div>
        <div className="step active">2 <span>CHECKOUT</span></div>
        <div className="step active">3 <span>PAYMENT</span></div>
        <div className={`step ${paymentCompleted ? 'active' : ''}`}>4 <span>CONFIRMATION</span></div>
      </div>

      <div className="payment-confirmation-container">
        {!paymentCompleted ? (
          <div className="payment-section">
            <h2>Payment</h2>
            <form className="payment-form">
              <div className="payment-method">
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="creditCard"
                    checked={paymentMethod === 'creditCard'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Credit Card
                </label>
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="debitCard"
                    checked={paymentMethod === 'debitCard'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Debit Card
                </label>
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  PayPal
                </label>
              </div>

              {(paymentMethod === 'creditCard' || paymentMethod === 'debitCard') && (
                <div className="credit-card-info">
                  <label>Card Number</label>
                  <input type="text" required />

                  <label>Expiration Date</label>
                  <div className="expiration-date-select">
                    <select required value={expMonth} onChange={(e) => setExpMonth(e.target.value)}>
                      <option value="">Month</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                          {(i + 1).toString().padStart(2, '0')}
                        </option>
                      ))}
                    </select>

                    <select required value={expYear} onChange={(e) => setExpYear(e.target.value)}>
                      <option value="">Year</option>
                      {Array.from({ length: 10 }, (_, i) => {
                        const year = new Date().getFullYear() + i;
                        return (
                          <option key={year} value={year.toString().slice(2)}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <label>CVV</label>
                  <input type="text" required />
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div className="paypal-info">
                  <label>PayPal Email</label>
                  <input type="email" required />
                </div>
              )}

              {paymentError && <p className="payment-error">{paymentError}</p>}

              <button type="button" className="complete-payment-button" onClick={handleCompletePayment}>
  Complete Payment
</button>
            </form>
          </div>
        ) : (
          <div className="confirmation-section">
            <h2>Order Confirmation</h2>
            <p>Your order has been placed successfully!</p>
            <div className="order-details">
              <ul>
                <li><strong>Order Number:</strong> {orderDetails.orderNumber}</li>
                <li><strong>Shipping Address:</strong> {orderDetails.shippingAddress}</li>
                <li><strong>Total Price:</strong> ${orderDetails.totalPrice.toFixed(2)}</li>
              </ul>
            </div>
            <button className="download-invoice-button button" onClick={generateInvoice}>
  Download Invoice
</button>
<button className="continue-shopping-button button" onClick={() => navigate('/')}>
  Continue Shopping
</button>
          </div>
        )}
      </div>
    </>
  );
};

export default PaymentConfirmation;
