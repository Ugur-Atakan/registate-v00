import AdminDashboardLayout from '../../../components/layout/AdminDashboardLayout';

const AdminTicketDetailsPage = () => {
  return (
    <AdminDashboardLayout>
    <div id="root" className="min-h-screen bg-neutral-50">
      <main id="main-content" className="p-8">
        <header id="header" className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-neutral-100 rounded-lg">
              <i className="fa-solid fa-arrow-left w-5 h-5"></i>
            </button>
            <div>
              <h1 className="text-2xl font-semibold">Ticket #1234</h1>
              <p className="text-sm text-neutral-500">Issue with Virtual Mailbox Service</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="px-3 py-1 text-xs bg-neutral-900 text-white rounded-full">High Priority</span>
            <span className="px-3 py-1 text-xs bg-neutral-100 rounded-full">Open</span>
            <button className="px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50">
              <i className="fa-solid fa-ellipsis-h">....</i>
            </button>
          </div>
        </header>

        <div id="ticket-details" className="grid grid-cols-3 gap-6">
          {/* Conversation and Reply Section */}
          <div className="col-span-2">
            <div id="conversation" className="bg-white rounded-lg border border-neutral-200 p-6 mb-6">
              <div className="space-y-6">
                {/* Conversation Item 1 */}
                <div className="flex space-x-4">
                  <img
                    src="https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=456"
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-medium">John Doe</span>
                        <span className="text-neutral-500 text-sm ml-2">Customer</span>
                      </div>
                      <span className="text-sm text-neutral-500">Jan 15, 2025 10:30 AM</span>
                    </div>
                    <div className="bg-neutral-50 rounded-lg p-4">
                      <p>
                        Unable to access the virtual mailbox dashboard. Getting error 404 when trying to log in. I've tried clearing my cache and using different browsers but the issue persists.
                      </p>
                    </div>
                  </div>
                </div>
                {/* Conversation Item 2 */}
                <div className="flex space-x-4">
                  <img
                    src="https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=789"
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-medium">Sarah Wilson</span>
                        <span className="text-neutral-500 text-sm ml-2">Support Agent</span>
                      </div>
                      <span className="text-sm text-neutral-500">Jan 15, 2025 11:15 AM</span>
                    </div>
                    <div className="bg-neutral-50 rounded-lg p-4">
                      <p>
                        Hi John, I'm sorry you're experiencing this issue. Could you please provide your account email address and confirm when this issue started? Also, could you share a screenshot of the error message you're seeing?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reply Box */}
            <div id="reply-box" className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Reply to ticket</label>
                <textarea
                  className="w-full h-32 p-3 border border-neutral-200 rounded-lg resize-none"
                  placeholder="Type your message here..."
                ></textarea>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg">
                    <i className="fa-solid fa-paperclip w-5 h-5"></i>
                  </button>
                  <button className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg">
                    <i className="fa-regular fa-face-smile w-5 h-5"></i>
                  </button>
                </div>
                <button className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm hover:bg-neutral-800">
                  Send Reply
                </button>
              </div>
            </div>
          </div>

          {/* Ticket Sidebar */}
          <div id="ticket-sidebar" className="space-y-6">
            {/* Customer Details */}
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Customer Details</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=456"
                    alt="Customer Avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-neutral-500">john.doe@email.com</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-neutral-200">
                  <p className="text-sm text-neutral-500 mb-2">Company</p>
                  <p>Acme Corporation</p>
                </div>
                <div className="pt-4 border-t border-neutral-200">
                  <p className="text-sm text-neutral-500 mb-2">Phone</p>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
            </div>
            {/* Ticket Information */}
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Ticket Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Assigned to</p>
                  <div className="flex items-center space-x-2">
                    <img
                      src="https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=789"
                      alt="Agent Avatar"
                      className="w-6 h-6 rounded-full"
                    />
                    <span>Sarah Wilson</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-neutral-200">
                  <p className="text-sm text-neutral-500 mb-1">Created</p>
                  <p>Jan 15, 2025 10:30 AM</p>
                </div>
                <div className="pt-4 border-t border-neutral-200">
                  <p className="text-sm text-neutral-500 mb-1">Last Updated</p>
                  <p>Jan 15, 2025 11:15 AM</p>
                </div>
                <div className="pt-4 border-t border-neutral-200">
                  <p className="text-sm text-neutral-500 mb-1">Category</p>
                  <p>Technical Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    </AdminDashboardLayout>
  );
};

export default AdminTicketDetailsPage;
