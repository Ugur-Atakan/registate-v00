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

import BankAccountGuide from '../pages/feature-pages/bankAccountGuide';
import Formation from '../pages/feature-pages/formation';
import RegisteredAgent from '../pages/feature-pages/registeredAgent';
import CompanyNameCheck from '../pages/feature-pages/CompanyNameCheck';
import FormationDocuments from '../pages/feature-pages/formationDocuments';
import OnlineDashboard from '../pages/feature-pages/onlineDashboard';
import CustomerSupport from '../pages/feature-pages/customerSupport';
import VirtualMailbox from '../pages/feature-pages/VirtualMailbox';
import ComplianceReminder from '../pages/feature-pages/complianceReminder';
import AnnualReportFiling from '../pages/feature-pages/AnnualReportFiling';
import BoiReportFiling from '../pages/feature-pages/boiReportFiling';
import PostIncDocuments from '../pages/feature-pages/postIncDocuments';
import EIN from '../pages/feature-pages/EIN';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
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

      {/* Formation */}
      <Route
        path="/features/formation"
        element={
          <ProtectedRoute>
            <Formation />
          </ProtectedRoute>
        }
      />

      {/* Registered Agent */}
      <Route
        path="/features/registered-agent"
        element={
          <ProtectedRoute>
            <RegisteredAgent />
          </ProtectedRoute>
        }
      />

      {/* Company Name Check */}
      <Route
        path="/features/company-name-check"
        element={
          <ProtectedRoute>
            <CompanyNameCheck />
          </ProtectedRoute>
        }
      />

      {/* Formation Documents */}
      <Route
        path="/features/formation-documents"
        element={
          <ProtectedRoute>
            <FormationDocuments />
          </ProtectedRoute>
        }
      />

      {/* Online Dashboard */}
      <Route
        path="/features/online-dashboard"
        element={
          <ProtectedRoute>
            <OnlineDashboard />
          </ProtectedRoute>
        }
      />

      {/* Customer Support */}
      <Route
        path="/features/customer-support"
        element={
          <ProtectedRoute>
            <CustomerSupport />
          </ProtectedRoute>
        }
      />

      {/* EIN (Employer Identification Number) */}
      <Route
        path="/features/ein"
        element={
          <ProtectedRoute>
            <EIN />
          </ProtectedRoute>
        }
      />

      {/* Virtual Mailbox */}
      <Route
        path="/features/virtual-mailbox"
        element={
          <ProtectedRoute>
            <VirtualMailbox />
          </ProtectedRoute>
        }
      />

      {/* Compliance Reminder */}
      <Route
        path="/features/compliance-reminder"
        element={
          <ProtectedRoute>
            <ComplianceReminder />
          </ProtectedRoute>
        }
      />

      {/* Bank Account Guide */}
      <Route
        path="/features/bank-account-guide"
        element={
          <ProtectedRoute>
            <BankAccountGuide />
          </ProtectedRoute>
        }
      />

      {/* Annual Report Filing & Franchise Tax */}
      <Route
        path="/features/annual-report-filing"
        element={
          <ProtectedRoute>
            <AnnualReportFiling />
          </ProtectedRoute>
        }
      />

      {/* BOI Report Filing */}
      <Route
        path="/features/boi-report-filing"
        element={
          <ProtectedRoute>
            <BoiReportFiling />
          </ProtectedRoute>
        }
      />

      {/* Post-Inc Documents (one-time submission) */}
      <Route
        path="/features/post-inc-documents"
        element={
          <ProtectedRoute>
            <PostIncDocuments />
          </ProtectedRoute>
        }
      />

    </Routes>

  

  
  );
}