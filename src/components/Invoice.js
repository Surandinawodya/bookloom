import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Invoice = () => {
  const location = useLocation();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const token = localStorage.getItem('token');
      const orderId = location.state?.orderNumber;
      if (!orderId) return;

      const res = await fetch(`http://localhost:5000/api/order/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (res.ok) setOrder(data);
    };

    fetchOrder();
  }, [location]);

  if (!order) return <div>Loading invoice...</div>;

  return (
    <div className="invoice">
      <h2>Invoice #{order.invoice.orderNumber}</h2>
      <p>Date: {new Date(order.invoice.invoiceDate).toLocaleString()}</p>

      <h3>Customer Info</h3>
      <p>Name: {order.shippingDetails.name}</p>
      <p>Phone: {order.shippingDetails.phone}</p>

      <h3>Shipping</h3>
      <p>{order.shippingDetails.address}, {order.shippingDetails.city}, {order.shippingDetails.postalCode}</p>

      <h3>Payment</h3>
      <p>Method: {order.invoice.paymentMethod}</p>
      <p>Status: {order.invoice.paymentStatus}</p>

      <h3>Books Ordered</h3>
      <ul>
        {order.items.map((item, i) => (
          <li key={i}>
            {item.title} by {item.author} - {item.quantity} × Rs.{item.price}
          </li>
        ))}
      </ul>

      <h3>Total: Rs.{order.totalPrice}</h3>
    </div>
  );
};

export default Invoice;
