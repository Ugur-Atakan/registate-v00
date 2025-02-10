import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminDashboard from "../pages/admin";
import AdminUsers from "../pages/admin/Users";
import AdminCompanies from "../pages/admin/Companies";
import AdminSupport from "../pages/admin/Support";
import AdminProducts from "../pages/admin/Products";
import AdminTasks from "../pages/admin/Tasks";
import AdminFormationDashboard from "../pages/admin/Formation";
import AdminOrderDashboard from "../pages/admin/Orders";

export default function AdminRoutes() {
  return (
    <ProtectedRoute>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/users" element={<AdminUsers />} />
        <Route path="/support" element={<AdminSupport />} />
        <Route path="/companies" element={<AdminCompanies />} />
        <Route path="/products" element={<AdminProducts />} />
        <Route path="/task" element={<AdminTasks />} />
        <Route path="/formation" element={<AdminFormationDashboard/>} />
        <Route path="/orders" element={<AdminOrderDashboard />} />
      </Routes>
    </ProtectedRoute>
  );
}
