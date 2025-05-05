import React, { useEffect, useState } from 'react';
import Header from './Header';
import axios from 'axios';
import './MyProfilePage.css';

const MyProfilePage = () => {
  const [profile, setProfile] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    address: '', // <-- Address state
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    axios.get('http://localhost:5000/api/auth/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setProfile(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to fetch profile'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    try {
      await axios.put('http://localhost:5000/api/auth/profile', {
        fullName: profile.fullName,
        phoneNumber: profile.phoneNumber,
        address: profile.address,
        password: newPassword,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Profile updated!');
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile');
    }
  };

  return (
    <>
      <Header />
      <div className="profile-container">
        <div className="profile-header"><h2>My Profile</h2></div>
        <div className="profile-content">
          {error && <div className="error-message">{error}</div>}

          <h3>Personal Details</h3>
          <form onSubmit={handleSubmit}>
            <label>Full Name</label>
            <input type="text" value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} />

            <label>Phone Number</label>
            <input type="text" value={profile.phoneNumber} onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })} />

            <label>Email Address</label>
            <input type="email" value={profile.email} disabled />

            <label>Address</label>
            <input type="text" value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} />

            <h3>Change Password</h3>
            <label>New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />

            <label>Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

            <button type="submit">Update Profile</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default MyProfilePage;
