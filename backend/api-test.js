// api-test.js - Add this file to test your API endpoints directly
const axios = require('axios');

// Test registration
async function testRegister() {
  try {
    console.log('Testing registration endpoint...');
    
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      fullName: 'Test User',
      address: '123 Test St'
    });
    
    console.log('Registration successful:', response.data);
  } catch (error) {
    console.error('Registration failed:');
    console.error('Status:', error.response?.status);
    console.error('Response data:', error.response?.data);
    console.error('Error message:', error.message);
  }
}

// Test login
async function testLogin() {
  try {
    console.log('Testing login endpoint...');
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    
    console.log('Login successful:', response.data);
    return response.data.token;
  } catch (error) {
    console.error('Login failed:');
    console.error('Status:', error.response?.status);
    console.error('Response data:', error.response?.data);
    console.error('Error message:', error.message);
    return null;
  }
}

// Run the tests
async function runTests() {
  await testRegister();
  const token = await testLogin();
  
  if (token) {
    console.log('Authentication flow works! Token:', token);
  } else {
    console.log('Authentication flow failed');
  }
}

runTests();

// Instructions for using this test file:
// 1. Save this as api-test.js in your project root
// 2. Make sure your server is running
// 3. Run with: node api-test.js
// 4. Check the console output for detailed error information

// TROUBLESHOOTING DATABASE CONNECTION
/*
If you're having MongoDB connection issues:

1. Check your .env file has the correct MONGO_URI:
   - For local MongoDB: MONGO_URI=mongodb://localhost:27017/bookloom
   - For MongoDB Atlas: MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/bookloom

2. Make sure MongoDB is running if using local instance

3. If using MongoDB Atlas:
   - Check network access (IP whitelist)
   - Verify username/password
   - Ensure your MongoDB user has read/write access

4. Try connecting manually with the MongoDB shell or Compass to verify your connection string
*/

// FRONTEND FIXES - If you still have issues after fixing the backend:
/*
In your React app's Register.js, add this console logging:

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;
  
  setLoading(true);
  setErrorMessage('');
  
  // Log the data we're sending to the server
  console.log('Sending registration data:', {
    username: form.username,
    email: form.email,
    password: form.password, // In real app, don't log passwords!
    fullName: form.fullName,
    address: form.address
  });
  
  try {
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      username: form.username,
      email: form.email,
      password: form.password,
      fullName: form.fullName,
      address: form.address
    });
    
    console.log('Registration response:', response.data);
    alert('Registration successful!');
    navigate('/login');
  } catch (err) {
    console.error('Registration error:', err);
    console.error('Error details:', err.response?.data);
    setErrorMessage(
      err.response?.data?.message || 
      'Registration failed. Please try again.'
    );
  } finally {
    setLoading(false);
  }
};
*/