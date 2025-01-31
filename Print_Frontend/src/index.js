import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import Router and Routes
import './index.css';
import App from './App';
import FormPage from './FormPage/FormPage'; // Import the FormPage component
import NextPage from './NextPage/NextPage'; // Import the NextPage component
import reportWebVitals from './reportWebVitals';
import PaymentStatus from './PaymentsPage/PaymentStatus';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
      <Route path="/" element={<App />} />
        <Route path="/form/:id" element={<FormPage />} /> {/* Pass param to FormPage */}
        <Route path="/next-page/:id" element={<NextPage />} /> {/* Pass param to NextPage */}
        <Route path="/status/:id" element={<PaymentStatus />} /> {/* Pass param to NextPage */}

      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
