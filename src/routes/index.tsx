import { Routes, Route } from "react-router-dom";
import Welcome from "../pages/Welcome";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import CompanyFormation from "../pages/CompanyFormation/index";
import Payment from "../pages/Payment";
import ProtectedRoute from "./ProtectedRoute";
import CompanyTypeQuiz from "../pages/CompanyTypeQuiz";
import AfterBilling from "../pages/AfterBilling";
import AfterBillingDetails from "../pages/AfterBilling/Details";
import AdminRoutes from "./AdminRoutes";
import DashboardRoutes from "./DashoardRoutes";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/dashboard/*" element={<DashboardRoutes />} />
      <Route path="/after-billing" element={<AfterBilling />} />
      <Route path="/after-billing-details" element={<AfterBillingDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/company-formation" element={<CompanyFormation />} />
      <Route path="/company-type-quiz" element={<CompanyTypeQuiz />}/>
      <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
    </Routes>
  );
}
