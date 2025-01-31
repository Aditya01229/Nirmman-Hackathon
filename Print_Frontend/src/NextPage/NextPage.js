import React, { useState } from "react";
import axios from "axios";
import "./NextPage.css";
import { useParams } from "react-router-dom";

const NextPage = () => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [files, setFiles] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [isPaymentEnabled, setIsPaymentEnabled] = useState(false);
  const { id } = useParams();

  const handleFileChange = (event) => {
    setFiles({ file: event.target.files[0] });
  };

  const handleUpload = async () => {
    if (!files.file) {
      alert("Please select a file before uploading.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    const copiesInput = document.getElementById("copies");
    const colorInput = document.getElementById("color");
    const printTypeInput = document.getElementById("print-type");

    formData.append("files", files.file);
    formData.append("copies", parseInt(copiesInput?.value || "1", 10));
    formData.append("color", colorInput?.value);
    formData.append("front_back", printTypeInput?.value);

    console.log("Sending FormData:", Object.fromEntries(formData.entries()));

    try {
      const response = await axios.post(
       ` https://nirmman-hackathon-two.vercel.app/print-request/uploadfiles/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("Full API Response:", response.data);
      setTotalAmount(response.data || 0);
      setIsPaymentEnabled(true);
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error.response ? error.response.data : error.message);
      alert(error.response?.data?.message || "File upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handlePayment = async () => {
    if (totalAmount === 0) {
      alert("Please get the total amount before proceeding to payment.");
      return;
    }

    try{
      const response = await axios.patch(`https://nirmman-hackathon-two.vercel.app/shop/markpaid/${id}`);
      console.log(response);
    }
    catch(err){}

    const data = {
      name: "Sahil",
      mobileNumber: 1234567890,
      amount: totalAmount,
      request_id: id
    };

    try {
      const response = await axios.post("https://nirmman-hackathon-two.vercel.app/create-order", data);
      console.log(response.data);
      window.location.href = response.data.url;
    } catch (error) {
      console.log("Error in payment:", error);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div className="next-page-container">
      <h1>Upload Details</h1>
      <div className="print-column">
        <h2>Upload Image</h2>
        <div className="input-group">
          <label htmlFor="file">Choose File:</label>
          <input type="file" id="file" accept=".pdf" onChange={handleFileChange} />
        </div>
        <div className="input-group">
          <label htmlFor="copies">Number of Copies:</label>
          <input type="number" id="copies" min="1" defaultValue="1" />
        </div>
        <div className="input-group">
          <label>Color Print:</label>
          <select id="color">
            <option value="true">Color</option>
            <option value="false">Black & White</option>
          </select>
        </div>
        <div className="input-group">
          <label>Print Type:</label>
          <select id="print-type">
            <option value="true">Both Sides</option>
            <option value="false">Single Side</option>
          </select>
        </div>
      </div>

      <button className="upload-button" onClick={handleUpload} disabled={isUploading}>
        {isUploading ? "Uploading..." : "Get Final Amount"}
      </button>

      <button 
        className="pay-now-button" 
        onClick={handlePayment} 
        disabled={!isPaymentEnabled || totalAmount === 0}
      >
        Pay Now
      </button>

      <div className="total-amount-container">
        <h2>Total Amount: ₹{totalAmount}</h2>
      </div>
    </div>
  );
};

export default NextPage;
