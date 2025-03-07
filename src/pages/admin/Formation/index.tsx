import AdminDashboardLayout from "../../../components/layout/AdminDashboardLayout";

import { useState } from "react";
import {Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "../../../components/Loading";
import StateFeesSection from "./sections/Fees";
import PricingPlansSection from "./sections/Plans";
import StatesSection from "./sections/States";
import CompanyTypesSection from "./sections/CompanyTypes";
import AdminAvatar from "../../../components/AdminAvatar";
const sections = [
  { key: "pricing_plans", label: "Pricing Plans" },
  { key: "fees", label: "State Fees & Expedited Fees" },
  { key: "states", label: "States" },
  { key: "company_types", label: "Company Types" },
  {key: "formation_steps", label: "Formation Steps"},
];

export default function AdminFormationDashboard() {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <AdminDashboardLayout>
        <LoadingComponent />
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <main className="p-4">
        {/* Header */}
        <header className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-4">
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5" />
            </button>
            <AdminAvatar/>
          </div>
        </header>

        {/* Tab Menüsü */}
        <div className="mb-6 border-b">
          <nav className="flex space-x-4">
            {sections.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-2 px-4 ${
                  activeTab === tab.key
                    ? "border-b-2 border-blue-600 font-semibold"
                    : "text-gray-500"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div>
          {activeTab === "pricing_plans" && (
           <PricingPlansSection />
          )}

  
          {activeTab === "fees" && (
           <StateFeesSection />
          )}

          {activeTab === "states" && (
           <StatesSection />
          )}

       
          {activeTab === "company_types" && (
          <CompanyTypesSection />
          )}
                  
        {activeTab === "formation_steps" && (
            <div>
              <p>Formation Step Defination</p>
            </div>
          )}
        </div>
      </main>
    </AdminDashboardLayout>
  );
}
