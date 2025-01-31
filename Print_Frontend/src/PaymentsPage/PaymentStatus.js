import { useParams } from "react-router-dom";
import "./PaymentStatus.css"; // Import the CSS file

const PaymentStatus = () => {
  const { id } = useParams();

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h1>✅ Payment Successful!</h1>
        <p>Your payment ID: <strong>{id}</strong></p>
      </div>
    </div>
  );
};

export default PaymentStatus;
