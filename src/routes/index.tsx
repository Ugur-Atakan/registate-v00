import { Routes, Route } from 'react-router-dom';
import Welcome from '../pages/Welcome';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import Dashboard from '../pages/Dashboard';
import Companies from '../pages/Companies';
import CompanyFormation from '../pages/CompanyFormation/index';
import Payment from '../pages/Payment';
import ProtectedRoute from './ProtectedRoute';
import Services from '../pages/Services';
import CompanyTypeQuiz from '../pages/CompanyTypeQuiz';
import AfterBilling from '../pages/AfterBilling';
import AfterBillingDetails from '../pages/AfterBilling/Details';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/after-billing" element={<AfterBilling />} />
      <Route path="/after-billing-details" element={<AfterBillingDetails/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route
        path="/company-formation"
        element={
          <ProtectedRoute>
            <CompanyFormation />
          </ProtectedRoute>
        }
      />
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

    </Routes>

  

  
  );
}