import React, { useState, useEffect } from "react";
import "./App.css"; // Import the CSS file

const App = () => {
  const [shops, setShops] = useState([]);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch(
          "https://nirmman-hackathon-two.vercel.app/shop/getallshops"
        );
        const data = await response.json();
        setShops(data);
      } catch (error) {
        console.error("Error fetching shops:", error);
      }
    };

    fetchShops();
  }, []);

  const handlePrintClick = (shopId) => {
    window.location.href = `https://print-frontend-ten.vercel.app/form/${shopId}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Header */}
      <header>
        <h1>VIIT Printing Services</h1>
        <p className="mt-2 text-lg text-gray-600">
          Your one-stop solution for all printing needs
        </p>
      </header>

      {/* Main Content */}
      <main>
        {/* Shop Cards Container */}
        <div className="shop-container">
          {shops.map((shop) => (
            <div key={shop.id} className="shop-card">
              <h2>{shop.name}</h2>
              <p>Phone: {shop.phn_number}</p>
              <button onClick={() => handlePrintClick(shop.id)}>
                Print Now
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;
