export const addToCart = async (book) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?._id;
  
      if (!userId) {
        alert('Please log in to add books to your cart.');
        return;
      }
  
      const response = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ book }),
      });
  
      if (response.ok) {
        alert(`"${book.title}" added to cart`);
      } else {
        const errorData = await response.json();
        console.error('Failed to add book to cart:', errorData.message);
        alert('Failed to add book to cart');
      }
    } catch (err) {
      console.error('Error adding book to cart:', err);
      alert('An error occurred while adding to cart.');
    }
  };
  