import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getTicketDetails } from '../../http/requests/companyRequests';
import toast from 'react-hot-toast';

const TicketDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ticketId = location.state?.ticketId;
  
  const [ticketDetails, setTicketDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      if (!ticketId) {
        toast.error("Ticket ID is missing");
        return;
      }
      setLoading(true);
      try {
        const ticket = await getTicketDetails(ticketId);
        setTicketDetails(ticket);
        console.log("Fetched ticket:", ticket);
      } catch (error) {
        console.error("Error fetching ticket details:", error);
        toast.error("Failed to load ticket details");
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, [ticketId]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse text-gray-500">Loading ticket details...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!ticketDetails) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-500">Ticket not found</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <main id="main-content" className="p-4">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-neutral-100 rounded-lg"
            >
              <i className="fa-solid fa-arrow-left w-5 h-5"></i>
            </button>
            <div>
              <h1 className="text-2xl font-semibold">{ticketDetails.subject}</h1>
              <p className="text-sm text-neutral-500">{ticketDetails.category}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="px-3 py-1 text-xs bg-neutral-900 text-white rounded-full">
              {ticketDetails.priority}
            </span>
            <span className="px-3 py-1 text-xs bg-neutral-100 rounded-full">
              {ticketDetails.status}
            </span>
            <button className="px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50">
              <i className="fa-solid fa-ellipsis-h"></i>
            </button>
          </div>
        </header>

        <div id="ticket-details" className="grid grid-cols-3 gap-6">
          {/* Conversation and Reply Section */}
          <div className="col-span-2">
            <section id="conversation" className="bg-white rounded-lg border border-neutral-200 p-6 mb-6">
              <div className="space-y-6">
                {ticketDetails.messages && ticketDetails.messages.length > 0 ? (
                  ticketDetails.messages.map((msg) => (
                    <ConversationItem key={msg.id} message={msg} />
                  ))
                ) : (
                  <p className="text-neutral-500">No messages yet.</p>
                )}
              </div>
            </section>

            {/* Reply Box */}
            <section id="reply-box" className="bg-white rounded-lg border border-neutral-200 p-6">
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
            </section>
          </div>

          {/* Ticket Sidebar */}
          <aside id="ticket-sidebar" className="space-y-6">
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Ticket Information</h3>
              <div className="space-y-4">
                <div className="pt-4 border-t border-neutral-200">
                  <p className="text-sm text-neutral-500 mb-1">Created</p>
                  <p>{new Date(ticketDetails.createdAt).toLocaleString()}</p>
                </div>
                <div className="pt-4 border-t border-neutral-200">
                  <p className="text-sm text-neutral-500 mb-1">Last Updated</p>
                  <p>{new Date(ticketDetails.updatedAt).toLocaleString()}</p>
                </div>
                <div className="pt-4 border-t border-neutral-200">
                  <p className="text-sm text-neutral-500 mb-1">Category</p>
                  <p>{ticketDetails.category}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default TicketDetailsPage;

const ConversationItem = ({ message }) => {
  return (
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
            <span className="text-neutral-500 text-sm ml-2">
              {message.isStaff ? 'Registate' : 'You'}
            </span>
          </div>
          <span className="text-sm text-neutral-500">
            {new Date(message.createdAt).toLocaleString()}
          </span>
        </div>
        <div className="bg-neutral-50 rounded-lg p-4">
          <p>{message.message}</p>
        </div>
      </div>
    </div>
  );
};
