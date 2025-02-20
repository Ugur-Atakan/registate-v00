import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  ArrowLeft,
  Clock,
  AlertCircle,
  MessageSquare,
  Paperclip,
  Send,
  FileText,
  X,
  User,
  Download
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getTicketDetails } from '../../http/requests/companyRequests';

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
  category: 'ACCOUNT' | 'PAYMENT' | 'TECHNICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  isActivate: boolean;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

const TicketDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      if (!location.state?.ticketId) {
        toast.error('Ticket ID is missing');
        return;
      }

      try {
        const response = await getTicketDetails(location.state.ticketId);
        setTicket(response);
      } catch (error) {
        console.error('Error fetching ticket details:', error);
        toast.error('Failed to load ticket details');
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, [location.state?.ticketId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitMessage = async () => {
    if (!newMessage.trim() && attachments.length === 0) return;

    try {
      // Here you would normally upload files and get their URLs
      const messageData = {
        message: newMessage,
        attachments: attachments.map(file => ({
          name: file.name,
          url: URL.createObjectURL(file),
          type: file.type,
          ticketId: ticket?.id
        }))
      };

      // API call would go here
      console.log('Submitting message:', messageData);
      toast.success('Message sent successfully');
      
      // Clear form
      setNewMessage('');
      setAttachments([]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
      case 'RESOLVED':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'IN_PROGRESS':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
  };

  const getPriorityColor = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'MEDIUM':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'LOW':
        return 'bg-green-50 text-green-700 border-green-200';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin w-8 h-8 border-4 border-[--primary] border-t-transparent rounded-full"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!ticket) {
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard/support')}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">Ticket #{ticket.ticketNo}</h1>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                  {ticket.status}
                </span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority} Priority
                </span>
              </div>
              <p className="text-gray-600 mt-1">{ticket.subject}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Message List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="space-y-6">
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
                          {message.isStaff ? 'Support Team' : 'You'}
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
                        <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
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

            {/* Reply Box */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your reply here..."
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none 
                  focus:ring-2 focus:ring-[--primary] focus:border-transparent resize-none"
                rows={4}
              />

              {/* Attachments */}
              {attachments.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg"
                    >
                      <FileText size={14} className="text-gray-500" />
                      <span className="text-sm text-gray-600">{file.name}</span>
                      <button
                        onClick={() => removeAttachment(index)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between mt-4">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2 text-gray-500 hover:text-[--primary] transition-colors">
                    <Paperclip size={20} />
                    <span className="text-sm">Attach files</span>
                  </div>
                </label>

                <button
                  onClick={handleSubmitMessage}
                  disabled={!newMessage.trim() && attachments.length === 0}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[--primary] text-white 
                    rounded-lg hover:bg-[--primary]/90 transition-colors disabled:opacity-50 
                    disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                  Send Reply
                </button>
              </div>
            </div>
          </div>

          {/* Ticket Information Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Ticket Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Category</p>
                  <div className="flex items-center gap-2">
                    <MessageSquare size={16} className="text-gray-400" />
                    <span>{ticket.category}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">Created</p>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    <span>{new Date(ticket.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    <span>{new Date(ticket.updatedAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm 
                    font-medium ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">Priority</p>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm 
                    font-medium ${getPriorityColor(ticket.priority)}`}>
                    <AlertCircle size={14} />
                    {ticket.priority} Priority
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TicketDetails;