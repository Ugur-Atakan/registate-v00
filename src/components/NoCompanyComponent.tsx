import { ArrowUpRight, Building2, Check, Info, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

const NoCompanyComponentModal = () => {
    const userData=useAppSelector((state)=>state.user.userData);
    const navigate=useNavigate();
    return (
      <>
        <div className="max-w-5xl mx-auto px-4">
          {/* Welcome Card */}
          <div className="bg-gradient-to-br from-[--primary] to-blue-600 rounded-2xl p-8 mb-8 text-white">
            <h1 className="text-3xl font-bold mb-3">
              Welcome to Registate, {userData.firstName}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              Let's get started with setting up your business presence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Create New Company Card */}
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="p-8">
                <div className="w-16 h-16 bg-[--primary]/10 rounded-2xl flex items-center justify-center mb-6 
                  group-hover:scale-110 transition-transform duration-300">
                  <Rocket className="w-8 h-8 text-[--primary]" />
                </div>
                
                <h2 className="text-2xl font-bold mb-3">Create New Company</h2>
                <p className="text-gray-600 mb-6">
                  Start fresh with a new business entity. We'll guide you through the entire formation process.
                </p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-gray-600">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    Easy online formation
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    Guided step-by-step process
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    All necessary documents included
                  </li>
                </ul>

                <button
                  onClick={() => navigate('/company-formation')}
                  className="w-full flex items-center justify-between px-6 py-4 bg-[--primary] text-white rounded-xl 
                    hover:bg-[--primary]/90 transition-colors group"
                >
                  <span className="font-medium">Start Formation</span>
                  <ArrowUpRight className="w-5 h-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 
                    transition-transform" />
                </button>
              </div>
            </div>

            {/* Add Existing Company Card */}
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="p-8">
                <div className="w-16 h-16 bg-[--primary]/10 rounded-2xl flex items-center justify-center mb-6 
                  group-hover:scale-110 transition-transform duration-300">
                  <Building2 className="w-8 h-8 text-[--primary]" />
                </div>
                
                <h2 className="text-2xl font-bold mb-3">Add Existing Company</h2>
                <p className="text-gray-600 mb-6">
                  Already have a company? Connect it to your dashboard for easy management.
                </p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-gray-600">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    Quick company connection
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    Access all management tools
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    Seamless integration
                  </li>
                </ul>

                <button
                  onClick={() => navigate('/dashboard/companies')}
                  className="w-full flex items-center justify-between px-6 py-4 border-2 border-[--primary] 
                    text-[--primary] rounded-xl hover:bg-[--primary]/10 transition-colors group"
                >
                  <span className="font-medium">Connect Company</span>
                  <ArrowUpRight className="w-5 h-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 
                    transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Info className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Need Help Getting Started?</h3>
                <p className="text-gray-600">
                  Our support team is available 24/7 to assist you with any questions about company formation or 
                  management. Contact us anytime!
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }


export default NoCompanyComponentModal;