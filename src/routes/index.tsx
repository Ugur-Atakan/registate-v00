import { Routes, Route } from "react-router-dom";
import Welcome from "../pages/Welcome";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Dashboard from "../pages/dashboard";
import Companies from "../pages/dashboard/Companies";
import CompanyFormation from "../pages/CompanyFormation/index";
import Payment from "../pages/Payment";
import ProtectedRoute from "./ProtectedRoute";
import Services from "../pages/dashboard/Services";
import CompanyTypeQuiz from "../pages/CompanyTypeQuiz";
import AfterBilling from "../pages/AfterBilling";
import AfterBillingDetails from "../pages/AfterBilling/Details";
import AdminRoutes from "./AdminRoutes";
import Settings from "../pages/dashboard/Settings";
import Support from "../pages/dashboard/Support";
import Documents from "../pages/dashboard/Documents";
import NewSupportTicket from "../pages/dashboard/NewTicket";
import Tasks from "../pages/dashboard/Tasks";
import TaskDetails from "../pages/dashboard/TaskDetails";
import TicketDetailsPage from "../pages/dashboard/TicketDetails";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/after-billing" element={<AfterBilling />} />
      <Route path="/after-billing-details" element={<AfterBillingDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/dashboard/support" element={<Support />} />
      <Route path="/dashboard/ticket/details" element={<TicketDetailsPage />} />
      <Route path="/dashboard/support/new" element={<NewSupportTicket />} />
      <Route path="/dashboard/settings" element={<Settings />} />
      <Route path="/dashboard/tasks" element={<Tasks />} />
      <Route path="/dashboard/tasks/details" element={<TaskDetails />} />
      <Route path="/dashboard/documents" element={<Documents />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/companies"
        element={
          <ProtectedRoute>
            <Companies />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/services"
        element={
          <ProtectedRoute>
            <Services />
          </ProtectedRoute>
        }
      />
      <Route path="/company-formation" element={<CompanyFormation />} />
      <Route
        path="/company-type-quiz"
        element={
          <ProtectedRoute>
            <CompanyTypeQuiz />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment"
        element={
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        }
      />
      
    </Routes>
  );
}
