import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../pages/dashboard";

import Settings from "../pages/dashboard/Settings";
import Support from "../pages/dashboard/Support";
import Documents from "../pages/dashboard/Documents";
import NewSupportTicket from "../pages/dashboard/NewTicket";
import Tasks from "../pages/dashboard/Tasks";
import TaskDetails from "../pages/dashboard/TaskDetails";
import TicketDetailsPage from "../pages/dashboard/TicketDetails";
import Companies from "../pages/dashboard/Companies";
import Services from "../pages/dashboard/Services";
import ConnectCompanyPage from "../pages/dashboard/ConnectCompanyPage";
export default function DashboardRoutes() {
  return (
    <ProtectedRoute>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/support" element={<Support />} />
        <Route path="/support/new" element={<NewSupportTicket />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/connect-company" element={<ConnectCompanyPage />} />
        <Route path="/services" element={<Services />} />
        <Route path="/tasks/details" element={<TaskDetails />} />
        <Route path="/ticket/details" element={<TicketDetailsPage />} />
      </Routes>
    </ProtectedRoute>
  );
}
