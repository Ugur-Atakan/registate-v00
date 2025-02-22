import { useState } from 'react';
import AdminDashboardLayout from '../../components/layout/AdminDashboardLayout';
import { ArrowLeft, Bell, Bold, Italic, Link, List, Paperclip } from 'lucide-react';

const demoTicket = {
  id: "t1",
  userId: "u1",
  subject: "Payment not processing",
  message: "Hello, I'm having issues processing my payment. When I try to complete the checkout, it shows an error message saying 'Transaction Failed'. I've tried multiple times but getting the same error. Please help.",
  status: "OPEN",
  priority: "HIGH",
  isActivate: true,
  createdAt: new Date(Date.now() - 7200000).toISOString(),
  updatedAt: new Date(Date.now() - 7200000).toISOString(),
  messages: [
    {
      id: "m1",
      ticketId: "t1",
      userId: "u1",
      message: "Hello, I'm having issues processing my payment. When I try to complete the checkout, it shows an error message saying 'Transaction Failed'. I've tried multiple times but getting the same error. Please help.",
      isStaff: false,
      createdAt: new Date(Date.now() - 7200000).toISOString()
    }
  ]
};

const demoUser = {
  firstName: "John",
  lastName: "Smith",
  telephone: "5374352423",
  profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=user1",
  notifications: true,
  isActivate: true
};
interface TicketDetailPageProps {
  onBack: () => void;
}


const AdminTicketDetailsPage = ({ onBack }:TicketDetailPageProps) => {
  const [replyText, setReplyText] = useState('');
  const [status, setStatus] = useState(demoTicket.status);
  const [priority, setPriority] = useState(demoTicket.priority);
  const [showSidebar, setShowSidebar] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) {
      return `${hours}h ago`;
    }
    return date.toLocaleDateString();
  };

  return (
    <AdminDashboardLayout>
    <main className="lg:p-8">
      {/* Mobile Sidebar Overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl lg:text-2xl font-semibold">Ticket #{demoTicket.id}</h1>
            <p className="text-sm text-gray-500 truncate max-w-[200px] lg:max-w-none">{demoTicket.subject}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {/* Mobile Sidebar Toggle */}
          <button
            className="lg:hidden px-3 py-1 text-sm border border-gray-200 rounded-lg"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            Info
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5" />
          </button>
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
            alt="Admin"
            className="w-10 h-10 rounded-full"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Messages */}
          <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm">
            <div className="flex items-start space-x-4">
              <img 
                src={demoUser.profileImage} 
                alt={`${demoUser.firstName} ${demoUser.lastName}`}
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 lg:gap-0">
                  <div>
                    <span className="font-medium">{demoUser.firstName} {demoUser.lastName}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      {formatDate(demoTicket.createdAt)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      status === 'OPEN' 
                        ? 'bg-[#EEF2FF] text-[#1649FF]'
                        : status === 'IN_PROGRESS'
                        ? 'bg-[#E8FFF3] text-[#9EE248]'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      priority === 'HIGH'
                        ? 'bg-red-100 text-red-600'
                        : priority === 'MEDIUM'
                        ? 'bg-[#EEF2FF] text-[#1649FF]'
                        : 'bg-[#E8FFF3] text-[#9EE248]'
                    }`}>
                      {priority.charAt(0) + priority.slice(1).toLowerCase()}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-gray-600 break-words">{demoTicket.message}</p>
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center text-sm text-gray-500">
                    <Paperclip className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">payment_error_screenshot.png</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reply Form */}
          <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Reply</label>
              <div className="border border-gray-200 rounded-lg">
                <div className="flex items-center p-2 border-b border-gray-200 overflow-x-auto">
                  <button className="p-2 hover:bg-gray-100 rounded flex-shrink-0">
                    <Bold className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded flex-shrink-0">
                    <Italic className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded flex-shrink-0">
                    <Link className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded flex-shrink-0">
                    <List className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full p-4 min-h-[200px] resize-none focus:outline-none"
                  placeholder="Type your reply..."
                />
              </div>
            </div>
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <button className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Paperclip className="w-4 h-4 mr-2" />
                  Attach Files
                </button>
                <button className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <List className="w-4 h-4 mr-2" />
                  Use Template
                </button>
              </div>
              <div className="flex items-center space-x-4 w-full lg:w-auto">
                <button className="flex-1 lg:flex-none px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  Save Draft
                </button>
                <button className="flex-1 lg:flex-none px-4 py-2 bg-[#1649FF] text-white rounded-lg hover:bg-blue-600">
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className={`fixed inset-y-0 right-0 w-80 lg:w-auto lg:static bg-white lg:bg-transparent transform transition-transform duration-300 ease-in-out ${
          showSidebar ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0 z-50 overflow-y-auto lg:overflow-visible`}>
          <div className="space-y-6 p-4 lg:p-0">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-4">Ticket Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  >
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  >
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-4">Customer Details</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <img
                    src={demoUser.profileImage}
                    alt={`${demoUser.firstName} ${demoUser.lastName}`}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="ml-3 min-w-0">
                    <p className="font-medium truncate">{demoUser.firstName} {demoUser.lastName}</p>
                    <p className="text-sm text-gray-500 truncate">{demoUser.telephone}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Member Since</span>
                    <span>Jan 15, 2025</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Total Tickets</span>
                    <span>5</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subscription</span>
                    <span>Premium</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    </AdminDashboardLayout>
  );
}

export default AdminTicketDetailsPage;
