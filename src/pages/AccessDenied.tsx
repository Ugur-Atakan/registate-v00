import { useNavigate } from "react-router-dom";

export default function AccessDenied() {
    const navigate=useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
        <p className="mt-4 text-gray-600">You do not have permission to access this page.</p>
        <p className="mt-2 text-sm text-gray-500">
          If you believe this is a mistake, please contact our support team.
        </p>
        <button
          onClick={() => navigate("/dashboard", { replace: true })}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Return to Homepage
        </button>
      </div>
    </div>
  );
}