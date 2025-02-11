import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";

export default function Support() {
    const navigate=useNavigate();

    const handleNewTicket=()=>{
        navigate('/dashboard/support/new');
    }

    return (
<DashboardLayout>
<main id="main-content">
        <header id="header" className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold">Support Tickets</h1>
            <p className="text-sm text-neutral-500">Manage your support requests</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm hover:bg-neutral-800" onClick={handleNewTicket}>
              <i className="fa-solid fa-plus mr-2" />
              New Ticket
            </button>
            <button className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg">
              <i className="fa-regular fa-bell w-5 h-5" />
            </button>
            <img
              src="https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=123"
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </header>

        {/* Tickets Filters */}
        <div id="tickets-filters" className="flex items-center space-x-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tickets..."
              className="pl-10 pr-4 py-2 border border-neutral-200 rounded-lg w-64"
            />
            <i className="fa-solid fa-search absolute left-3 top-2.5 text-neutral-400" />
          </div>
          <select className="px-4 py-2 border border-neutral-200 rounded-lg">
            <option>All Status</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Closed</option>
          </select>
          <select className="px-4 py-2 border border-neutral-200 rounded-lg">
            <option>Sort by: Newest</option>
            <option>Sort by: Oldest</option>
            <option>Sort by: Priority</option>
          </select>
        </div>

        {/* Tickets List */}
        <div id="tickets-list" className="space-y-4">
          {/* Ticket Item 1 */}
          <div className="bg-white p-6 rounded-lg border border-neutral-200" onClick={()=>navigate('/dashboard/ticket/details')}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <span className="px-3 py-1 text-xs bg-neutral-900 text-white rounded-full">
                  High Priority
                </span>
                <span className="px-3 py-1 text-xs bg-neutral-100 rounded-full">
                  Open
                </span>
                <span className="text-sm text-neutral-500">Ticket #1234</span>
              </div>
              <span className="text-sm text-neutral-500">
                Created on Jan 15, 2025
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Issue with Virtual Mailbox Service
            </h3>
            <p className="text-neutral-600 mb-4">
              Unable to access the virtual mailbox dashboard. Getting error 404 when
              trying to log in.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img
                  src="https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=456"
                  alt="User Avatar"
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm text-neutral-600">John Doe</span>
              </div>
              <button className="text-neutral-600 hover:text-neutral-900">
                <i className="fa-solid fa-arrow-right" />
              </button>
            </div>
          </div>

          {/* Ticket Item 2 */}
          <div className="bg-white p-6 rounded-lg border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <span className="px-3 py-1 text-xs bg-neutral-400 text-white rounded-full">
                  Medium Priority
                </span>
                <span className="px-3 py-1 text-xs bg-neutral-100 rounded-full">
                  In Progress
                </span>
                <span className="text-sm text-neutral-500">Ticket #1235</span>
              </div>
              <span className="text-sm text-neutral-500">
                Created on Jan 14, 2025
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Billing Question</h3>
            <p className="text-neutral-600 mb-4">
              Need clarification on the latest invoice for registered agent service.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img
                  src="https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=789"
                  alt="User Avatar"
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm text-neutral-600">Jane Smith</span>
              </div>
              <button className="text-neutral-600 hover:text-neutral-900">
                <i className="fa-solid fa-arrow-right" />
              </button>
            </div>
          </div>

          {/* Ticket Item 3 */}
          <div className="bg-white p-6 rounded-lg border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <span className="px-3 py-1 text-xs bg-neutral-300 text-white rounded-full">
                  Low Priority
                </span>
                <span className="px-3 py-1 text-xs bg-neutral-700 text-white rounded-full">
                  Closed
                </span>
                <span className="text-sm text-neutral-500">Ticket #1236</span>
              </div>
              <span className="text-sm text-neutral-500">
                Created on Jan 13, 2025
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Feature Request</h3>
            <p className="text-neutral-600 mb-4">
              Suggestion for adding calendar integration to the virtual office booking
              system.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img
                  src="https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=101"
                  alt="User Avatar"
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm text-neutral-600">Mike Johnson</span>
              </div>
              <button className="text-neutral-600 hover:text-neutral-900">
                <i className="fa-solid fa-arrow-right" />
              </button>
            </div>
          </div>
        </div>
      </main>
</DashboardLayout>
    );
}



