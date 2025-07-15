import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState({
    fullName: '',
    gender: '',
    contact: '',
    email: '',
    occupation: '',
  });

  const [isEditing, setIsEditing] = useState(true);

  // Simulate fetch from localStorage or API on first load
  useEffect(() => {
    const storedProfile = JSON.parse(localStorage.getItem('userProfile'));
    if (storedProfile) {
      setProfile(storedProfile);
      setIsEditing(false);
    }
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save profile data to localStorage or send to server
    localStorage.setItem('userProfile', JSON.stringify(profile));
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <h2>{isEditing ? 'Complete Your Profile' : 'Your Profile'}</h2>

      {isEditing ? (
        <form className="profile-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={profile.fullName}
            onChange={handleChange}
            required
          />
          <select
            name="gender"
            value={profile.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="text"
            name="contact"
            placeholder="Contact Number"
            value={profile.contact}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={profile.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="occupation"
            placeholder="Occupation"
            value={profile.occupation}
            onChange={handleChange}
            required
          />
          <button type="submit">Save Profile</button>
        </form>
      ) : (
        <div className="profile-card">
          <div className="profile-item">
            <span className="label">Full Name:</span>
            <span className="value">{profile.fullName}</span>
          </div>
          <div className="profile-item">
            <span className="label">Gender:</span>
            <span className="value">{profile.gender}</span>
          </div>
          <div className="profile-item">
            <span className="label">Contact:</span>
            <span className="value">{profile.contact}</span>
          </div>
          <div className="profile-item">
            <span className="label">Email:</span>
            <span className="value">{profile.email}</span>
          </div>
          <div className="profile-item">
            <span className="label">Occupation:</span>
            <span className="value">{profile.occupation}</span>
          </div>
          <button className="edit-btn" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
