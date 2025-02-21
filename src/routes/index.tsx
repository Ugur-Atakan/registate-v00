import { Routes, Route } from "react-router-dom";
import Welcome from "../pages/Welcome";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import CompanyFormation from "../pages/CompanyFormation/index";
import CompanyTypeQuiz from "../pages/CompanyTypeQuiz";
import AfterBilling from "../pages/AfterBilling";
import AfterBillingDetails from "../pages/AfterBilling/Details";
import AdminRoutes from "./AdminRoutes";
import DashboardRoutes from "./DashoardRoutes";
import NameGuide from "../pages/NameGuide";
import PostOrder from "../pages/PostOrder";


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
      <Route path="/name-guide" element={<NameGuide />} />
      <Route path="/post-order" element={<PostOrder />} />
    </Routes>
  );
}
