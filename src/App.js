import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Register from './pages/Register';
import BookList from './components/BookList';
import BookDetails from './components/BookDetails';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import PaymentConfirmation from './components/PaymentConfirmation';
import Wishlist from './components/Wishlist';
import About from './components/About';
import ContactUs from './components/ContactUs';
import MyProfilePage from './components/MyProfilePage'; // ✅ Import MyProfilePage
import { CartProvider } from './contexts/CartContext';
 
function App() {
  const books = [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      price: 10.99,
      coverImage: "https://via.placeholder.com/150",
      description: "A classic novel set in the Roaring Twenties."
    },
    {
      id: 2,
      title: "1984",
      author: "George Orwell",
      price: 9.99,
      coverImage: "https://via.placeholder.com/150",
      description: "A dystopian novel about totalitarian rule."
    },
    {
      id: 3,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      price: 12.99,
      coverImage: "https://via.placeholder.com/150",
      description: "A novel set in the Great Depression, exploring themes of racial injustice."
    }
  ];

  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Homepage" element={<Homepage />} />
          <Route path="/Booklist" element={<BookList books={books} />} />
          <Route path="/Bookdetails/:id" element={<BookDetails books={books} />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/Checkout" element={<Checkout />} />
          <Route path="/PaymentConfirmation" element={<PaymentConfirmation />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/About" element={<About/>} />
          <Route path="/ContactUs" element={<ContactUs/>} />
          <Route path="/MyProfilePage" element={<MyProfilePage />} /> {/* ✅ My Profile route */}
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
