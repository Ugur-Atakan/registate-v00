import { useEffect, useState } from "react";
import AdminDashboardLayout from "../../components/layout/AdminDashboardLayout";
import instance from "../../http/instance";

export default function AdminSupport() {
  const [tickets, setTickets] = useState([]);

  const fetchTickets = async () => {
    const res = await instance.get("/admin/support/tickets");
    setTickets(res.data);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <AdminDashboardLayout>
      
      <main id="main-content">
        <header id="header" className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold">Support Tickets</h1>
            <p className="text-sm text-neutral-500">
              Manage customer support tickets
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg">
              <i className="fa-regular fa-bell w-5 h-5"></i>
            </button>
            <img
              src="https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=admin"
              alt="Admin Avatar"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </header>

        {/* Ticket Filters */}
        <div
          id="ticket-filters"
          className="flex items-center justify-between mb-6"
        >
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-neutral-900 text-white rounded-lg">
              All Tickets
            </button>
            <button className="px-4 py-2 bg-white text-neutral-600 rounded-lg">
              Open
            </button>
            <button className="px-4 py-2 bg-white text-neutral-600 rounded-lg">
              In Progress
            </button>
            <button className="px-4 py-2 bg-white text-neutral-600 rounded-lg">
              Resolved
            </button>
          </div>
          <div className="flex space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tickets..."
                className="pl-10 pr-4 py-2 border border-neutral-200 rounded-lg w-64"
              />
              <i className="fa-solid fa-search absolute left-3 top-3 text-neutral-400"></i>
            </div>
            <select className="px-4 py-2 border border-neutral-200 rounded-lg">
              <option>Sort by: Latest</option>
              <option>Sort by: Oldest</option>
              <option>Sort by: Priority</option>
            </select>
          </div>
        </div>

        {/* Tickets List */}
        <div id="tickets-list" className="bg-white rounded-lg shadow-sm">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-neutral-200 bg-neutral-50 text-sm font-medium">
            <div className="col-span-1">ID</div>
            <div className="col-span-2">Customer</div>
            <div className="col-span-3">Subject</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Priority</div>
            <div className="col-span-1">Created</div>
            <div className="col-span-1">Actions</div>
          </div>
          <div className="divide-y divide-neutral-200">
            {/* Ticket Item 1 */}
            <div className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-neutral-50">
              <div className="col-span-1 text-sm">#1234</div>
              <div className="col-span-2 flex items-center">
                <img
                  src="https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=user1"
                  alt="User 1"
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span className="text-sm">John Smith</span>
              </div>
              <div className="col-span-3 text-sm">Payment not processing</div>
              <div className="col-span-2">
                <span className="px-2 py-1 text-xs bg-neutral-100 rounded-full">
                  Open
                </span>
              </div>
              <div className="col-span-2">
                <span className="px-2 py-1 text-xs bg-neutral-900 text-white rounded-full">
                  High
                </span>
              </div>
              <div className="col-span-1 text-sm">2h ago</div>
              <div className="col-span-1 flex space-x-2">
                <button className="p-2 hover:bg-neutral-100 rounded-lg">
                  <i className="fa-solid fa-eye"></i>
                </button>
                <button className="p-2 hover:bg-neutral-100 rounded-lg">
                  <i className="fa-solid fa-reply"></i>
                </button>
              </div>
            </div>
            {/* Ticket Item 2 */}
            <div className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-neutral-50">
              <div className="col-span-1 text-sm">#1235</div>
              <div className="col-span-2 flex items-center">
                <img
                  src="https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=user2"
                  alt="User 2"
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span className="text-sm">Sarah Johnson</span>
              </div>
              <div className="col-span-3 text-sm">Account login issues</div>
              <div className="col-span-2">
                <span className="px-2 py-1 text-xs bg-neutral-100 rounded-full">
                  In Progress
                </span>
              </div>
              <div className="col-span-2">
                <span className="px-2 py-1 text-xs bg-neutral-100 rounded-full">
                  Medium
                </span>
              </div>
              <div className="col-span-1 text-sm">5h ago</div>
              <div className="col-span-1 flex space-x-2">
                <button className="p-2 hover:bg-neutral-100 rounded-lg">
                  <i className="fa-solid fa-eye"></i>
                </button>
                <button className="p-2 hover:bg-neutral-100 rounded-lg">
                  <i className="fa-solid fa-reply"></i>
                </button>
              </div>
            </div>
            {/* Ticket Item 3 */}
            <div className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-neutral-50">
              <div className="col-span-1 text-sm">#1236</div>
              <div className="col-span-2 flex items-center">
                <img
                  src="https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=user3"
                  alt="User 3"
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span className="text-sm">Mike Wilson</span>
              </div>
              <div className="col-span-3 text-sm">Service not working</div>
              <div className="col-span-2">
                <span className="px-2 py-1 text-xs bg-neutral-100 rounded-full">
                  Open
                </span>
              </div>
              <div className="col-span-2">
                <span className="px-2 py-1 text-xs bg-neutral-900 text-white rounded-full">
                  High
                </span>
              </div>
              <div className="col-span-1 text-sm">1d ago</div>
              <div className="col-span-1 flex space-x-2">
                <button className="p-2 hover:bg-neutral-100 rounded-lg">
                  <i className="fa-solid fa-eye"></i>
                </button>
                <button className="p-2 hover:bg-neutral-100 rounded-lg">
                  <i className="fa-solid fa-reply"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div id="pagination" className="flex items-center justify-between mt-6">
          <p className="text-sm text-neutral-600">
            Showing 1-10 of 56 tickets
          </p>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50">
              Previous
            </button>
            <button className="px-4 py-2 bg-neutral-900 text-white rounded-lg">1</button>
            <button className="px-4 py-2 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50">
              2
            </button>
            <button className="px-4 py-2 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50">
              3
            </button>
            <button className="px-4 py-2 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50">
              Next
            </button>
          </div>
        </div>
      </main>
    </AdminDashboardLayout>
  );
}
