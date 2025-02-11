import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";

const Tasks = () => {

    const navigate=useNavigate();
  return (
        <DashboardLayout>
      <main id="main-content">
        <header id="header" className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold">Tasks</h1>
            <p className="text-sm text-neutral-500">
              Your pending tasks and requirements
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg">
              <i className="fa-regular fa-bell w-5 h-5"></i>
            </button>
            <img
              src="https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=123"
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </header>

        {/* Tasks List */}
        <div id="tasks-list" className="space-y-4">
          {/* Task Item 1 */}
          <div className="bg-white p-6 rounded-lg border border-neutral-200" onClick={()=>navigate('/dashboard/tasks/details')}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center">
                  <i className="fa-solid fa-file-signature text-white"></i>
                </div>
                <div>
                  <h3 className="font-semibold">Complete Company Registration</h3>
                  <p className="text-sm text-neutral-500">Due by Mar 15, 2025</p>
                </div>
              </div>
              <span className="px-3 py-1 text-xs bg-neutral-900 text-white rounded-full">
                High Priority
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <i className="fa-regular fa-circle-check text-neutral-400"></i>
                <span className="text-sm text-neutral-600">
                  Submit Articles of Organization
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fa-regular fa-circle text-neutral-400"></i>
                <span className="text-sm text-neutral-600">
                  Pay Registration Fee
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fa-regular fa-circle text-neutral-400"></i>
                <span className="text-sm text-neutral-600">
                  Obtain EIN Number
                </span>
              </div>
            </div>
          </div>

          {/* Task Item 2 */}
          <div className="bg-white p-6 rounded-lg border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center">
                  <i className="fa-solid fa-id-card text-white"></i>
                </div>
                <div>
                  <h3 className="font-semibold">Verify Business Address</h3>
                  <p className="text-sm text-neutral-500">Due by Mar 20, 2025</p>
                </div>
              </div>
              <span className="px-3 py-1 text-xs bg-neutral-700 text-white rounded-full">
                Medium Priority
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <i className="fa-regular fa-circle text-neutral-400"></i>
                <span className="text-sm text-neutral-600">
                  Upload Utility Bill
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fa-regular fa-circle text-neutral-400"></i>
                <span className="text-sm text-neutral-600">
                  Submit Lease Agreement
                </span>
              </div>
            </div>
          </div>

          {/* Task Item 3 */}
          <div className="bg-white p-6 rounded-lg border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center">
                  <i className="fa-solid fa-bank text-white"></i>
                </div>
                <div>
                  <h3 className="font-semibold">Set Up Business Banking</h3>
                  <p className="text-sm text-neutral-500">Due by Mar 25, 2025</p>
                </div>
              </div>
              <span className="px-3 py-1 text-xs bg-neutral-700 text-white rounded-full">
                Medium Priority
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <i className="fa-regular fa-circle text-neutral-400"></i>
                <span className="text-sm text-neutral-600">
                  Choose Business Bank Account
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fa-regular fa-circle text-neutral-400"></i>
                <span className="text-sm text-neutral-600">
                  Schedule Bank Appointment
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fa-regular fa-circle text-neutral-400"></i>
                <span className="text-sm text-neutral-600">
                  Prepare Required Documents
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
      </DashboardLayout>
  );
};

export default Tasks;
