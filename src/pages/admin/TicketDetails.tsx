import { useEffect, useState } from 'react';
import AdminDashboardLayout from '../../components/layout/AdminDashboardLayout';
import { ArrowLeft, Bell, Bold, Download, FileText, Italic, Link, List, Paperclip, User } from 'lucide-react';
import instance from '../../http/instance';
import toast from 'react-hot-toast';
import { uploadMessageAttachment } from '../../utils/fileUpload';
import { useLocation, useNavigate } from 'react-router-dom';
import { User as UserType } from '../../types/User';

interface Attachment {
  name: string;
  url: string;
  type: string;
}

interface Message {
  id: string;
  ticketId: string;
  userId: string;
  message: string;
  isStaff: boolean;
  createdAt: string;
  attachments: Attachment[];
}

interface Ticket {
  id: string;
  ticketNo: number;
  userId: string;
  subject: string;
  category: "ACCOUNT" | "PAYMENT" | "TECHNICAL";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  priority: "HIGH" | "MEDIUM" | "LOW";
  isActivate: boolean;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  user: UserType;
}


interface TicketDetailPageProps {
  onBack: () => void;
}


const AdminTicketDetailsPage = () => {
  const [replyText, setReplyText] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);


  const location = useLocation();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);

  const fetchTicketDetails = async () => {
    if (!location.state?.ticketId) {
      toast.error("Ticket ID is missing");
      return;
    }
    try {
      const response = await instance.get(`/admin/ticket/${location.state.ticketId}/details`);
      console.log("Ticket details:", response.data);
      setTicket(response.data);
    } catch (error) {
      console.error("Error fetching ticket details:", error);
      toast.error("Failed to load ticket details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    
    fetchTicketDetails();
  }, [location.state?.ticketId]);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments((prev) => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitMessage = async () => {
    if (!newMessage.trim() && attachments.length === 0) return;

    try {
      const attachment: Attachment[] = await Promise.all(
        attachments.map(async (file) => ({
          name: file.name,
          url: await uploadMessageAttachment(file, "ticket"),
          type: "TicketAttachment",
        }))
      );

      const messageData = {
        ticketId: ticket?.id,
        message: newMessage,
        attachments: attachment,
      };

      console.log("Message data:", messageData);
      await instance.post(`/support/add-message-to-ticket`, messageData);
      toast.success("Message sent successfully");
      await fetchTicketDetails();
      setNewMessage("");
      setAttachments([]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const getStatusColor = (status: Ticket["status"]) => {
    switch (status) {
      case "RESOLVED":
        return "bg-green-50 text-green-700 border-green-200";
      case "IN_PROGRESS":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
    }
  };

  const getPriorityColor = (priority: Ticket["priority"]) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-50 text-red-700 border-red-200";
      case "MEDIUM":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "LOW":
        return "bg-green-50 text-green-700 border-green-200";
    }
  };



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

  if(!ticket){
    return <div>Loading...</div>
  }
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
            onClick={() => navigate(-1)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl lg:text-2xl font-semibold">Ticket #{ticket.id}</h1>
            <p className="text-sm text-gray-500 truncate max-w-[200px] lg:max-w-none">{ticket.subject}</p>
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
                src={ticket.user.profileImage?? "https://api.dicebear.com/7.x/avataaars/svg?seed=user"} 
                alt={`${ticket.user.firstName} ${ticket.user.lastName}`}
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 lg:gap-0">
                  <div>
                    <span className="font-medium">{ticket.user.firstName} {ticket.user.lastName}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      {formatDate(ticket.createdAt)}
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
                      {ticket.status.charAt(0) + ticket.status.slice(1).toLowerCase().replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      ticket.priority === 'HIGH'
                        ? 'bg-red-100 text-red-600'
                        : ticket.priority === 'MEDIUM'
                        ? 'bg-[#EEF2FF] text-[#1649FF]'
                        : 'bg-[#E8FFF3] text-[#9EE248]'
                    }`}>
                      {ticket.priority.charAt(0) + ticket.priority.slice(1).toLowerCase()}
                    </span>
                  </div>
                </div>
                
                {ticket.messages.map((message) => (
                  <div key={message.id} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">
                          {message.isStaff ? "Support Team" : "You"}
                        </span>
                        {message.isStaff && (
                          <span className="px-2 py-0.5 text-xs bg-blue-50 text-blue-600 rounded-full">
                            Staff
                          </span>
                        )}
                        <span className="text-sm text-gray-500">
                          {new Date(message.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {message.message}
                        </p>
                      </div>

                      {message.attachments.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.attachments.map((attachment, index) => (
                            <a
                              key={index}
                              href={attachment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 
                                rounded-lg text-sm text-gray-600 transition-colors"
                            >
                              <FileText size={14} />
                              {attachment.name}
                              <Download size={14} className="text-gray-400" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
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
                    value={ticket.status}
                    onChange={(e) => setTicket({...ticket, status: e.target.value as Ticket["status"]})}
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
                    value={ticket.priority}
                    onChange={(e) => setTicket({...ticket, priority: e.target.value as Ticket["priority"]})}
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
                    src={ticket.user.profileImage?? "https://api.dicebear.com/7.x/avataaars/svg?seed=user"}
                    alt={`${ticket.user.firstName} ${ticket.user.lastName}`}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="ml-3 min-w-0">
                    <p className="font-medium truncate">{ticket.user.firstName} {ticket.user.lastName}</p>
                    <p className="text-sm text-gray-500 truncate">{ticket.user?.telephone?? " "}</p>
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
    </main>
    </AdminDashboardLayout>
  );
}

export default AdminTicketDetailsPage;
