import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './FormPage.css';

const FormPage = () => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  const handleImageClick = async () => {
    if (!userName || !userEmail) {
      alert('Please enter both name and email.');
      return;
    }

    // Add animation effect on image click
    const image = document.querySelector('.upload-image');
    image.classList.add('animate-click');

    const user = {
      name: userName,
      email: userEmail,
    };

    console.log('Submitting:', user);

    try {
      const response = await axios.post(
        `https://nirmman-hackathon-two.vercel.app/print-request/newrequest/${id}`,
        user,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Request successful:', response.data);

      // ✅ Navigate to the next page after a slight delay
      setTimeout(() => {
        navigate(`/next-page/${response.data.id}`); // Change '/next-page' to your actual route

        // ✅ If `navigate` fails, use `window.location.href` as a fallback
        setTimeout(() => {
          if (window.location.pathname !== `/next-page/${response.data.id}`) {
            window.location.href = `/next-page/${response.data.id}`;
          }
        }, 500);
      }, 300);

    } catch (error) {
      console.error('Error during request:', error);
      alert('An error occurred: ' + error.message);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Enter Your Details</h1>
      <div className="input-group">
        <input
          type="text"
          placeholder="Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
          className="input"
        />
        <input
          type="email"
          placeholder="Email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          required
          className="input"
        />
      </div>
      <div className="image-container">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCka4FwusmLbLaS_GPxWiNCse8FAWEDsdIMA&s"
          alt="Upload"
          className="upload-image"
          onClick={handleImageClick}
        />
      </div>
    </div>
  );
};

export default FormPage;
