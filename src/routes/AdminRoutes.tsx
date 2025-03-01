import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminDashboard from "../pages/admin";
import AdminUsers from "../pages/admin/Users";
import AdminCompanies from "../pages/admin/Companies/Companies";
import AdminCompanyDetailPage from "../pages/admin/Companies/CompanyDetailPage";
import AdminSupport from "../pages/admin/Support";
import AdminProducts from "../pages/admin/Products";
import AdminTasks from "../pages/admin/Tasks";
import AdminFormationDashboard from "../pages/admin/Formation";
import AdminOrderDashboard from "../pages/admin/Orders";
import AdminTicketDetailsPage from "../pages/admin/TicketDetails";
import AdminTaskDetailPage from "../pages/admin/TaskDetailPage";
import OrderDetails from "../pages/admin/OrderDetails";

export default function AdminRoutes() {
  return (
    <ProtectedRoute>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/users" element={<AdminUsers />} />
        <Route path="/support" element={<AdminSupport />} />
        <Route path="/support/details" element={<AdminTicketDetailsPage />} />
        <Route path="/companies" element={<AdminCompanies />} />
        <Route path="/company/details" element={<AdminCompanyDetailPage />} />
        <Route path="/products" element={<AdminProducts />} />
        <Route path="/tasks" element={<AdminTasks />} />
        <Route path="/tasks/details" element={<AdminTaskDetailPage />} />
        <Route path="/formation" element={<AdminFormationDashboard/>} />
        <Route path="/orders" element={<AdminOrderDashboard />} />
        <Route path="/orders/details" element={<OrderDetails />} />
      </Routes>
    </ProtectedRoute>
  );
}