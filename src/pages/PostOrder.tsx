import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import baseApi from "../http";

export default function PostOrder() {
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
  const navigate=useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get("session_id");

    if (!sessionId) {
      setMessage("Session ID not found in URL.");
      setLoading(false);
      return;
    }

    const fetchPaymentStatus = async () => {
      try {
        const response = await baseApi.get(
          `/checkout/stripe-success?session_id=${sessionId}`
        );
        if (response.data.success == true) {
          setMessage("Payment verified successfully.");
            setTimeout(() => {
                navigate("/dashboard");
            }, 5000);

        } else {
          setMessage("Payment failed.");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error verifying payment:", error);
        setMessage("Error verifying payment. Please try again.");
        setLoading(false);
      }
    };
    fetchPaymentStatus();
  }, [location.search]);


  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h1 className="text-2xl font-bold mb-4">Payment Status</h1>
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}
