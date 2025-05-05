const getProfile = async () => {
    const token = localStorage.getItem('authToken');  // Assuming the token is stored in localStorage
  
    const response = await fetch('/api/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    const data = await response.json();
    console.log(data);  // This should show the user's profile information
  };
  
  // Call getProfile when the component loads
  useEffect(() => {
    getProfile();
  }, []);
  