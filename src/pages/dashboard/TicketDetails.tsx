import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
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
  Download,
  Image,
  Video,
  Archive,
  FileIcon,
  CheckCircle2,
  Copy,
  Reply,
  Calendar,
  ArrowDown,
  Smile,
  CheckCheck
} from "lucide-react";
import toast from "react-hot-toast";
import { getTicketDetails } from "../../http/requests/companyRequests";
import { uploadMessageAttachment } from "../../utils/fileUpload";
import instance from "../../http/instance";
import LoadingComponent from "../../components/Loading";

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
}

// Function to format dates relative to now
const formatRelativeTime = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
};

// Function to group messages by date
const groupMessagesByDate = (messages: Message[]) => {
  const groups: { [key: string]: Message[] } = {};
  
  messages.forEach(message => {
    const date = new Date(message.createdAt);
    const dateKey = date.toDateString();
    
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    
    groups[dateKey].push(message);
  });
  
  return Object.entries(groups).map(([date, messages]) => ({
    date,
    messages
  }));
};

const TicketDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const fetchTicketDetails = async () => {
    if (!location.state?.ticketId) {
      toast.error("Ticket ID is missing");
      return;
    }
    try {
      const response = await getTicketDetails(location.state.ticketId);
      
      // Add message status for demonstration
      const messagesWithStatus = response.messages.map((msg: Message) => ({
        ...msg,
        status: !msg.isStaff ? "read" : undefined
      }));
      
      setTicket({
        ...response,
        messages: messagesWithStatus
      });
      
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

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [ticket?.messages.length]);

  // Handle scroll to detect when to show the scroll to bottom button
  useEffect(() => {
    const handleScroll = () => {
      if (!messagesContainerRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      
      // Show button when not at bottom
      setShowScrollToBottom(distanceFromBottom > 100);
    };
    
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleScrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setIsUploading(true);
      try {
        const newFiles = Array.from(files);
        setAttachments((prev) => [...prev, ...newFiles]);
      } catch (error) {
        toast.error("Error processing files");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files) {
      setIsUploading(true);
      try {
        const newFiles = Array.from(files);
        setAttachments((prev) => [...prev, ...newFiles]);
      } catch (error) {
        toast.error("Error uploading files");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };


  const handleCopyMessage = (message: string) => {
    navigator.clipboard.writeText(message);
    toast.success("Message copied to clipboard");
  };

  const handleSubmitMessage = async () => {
    if (!newMessage.trim() && attachments.length === 0) return;

    try {
      const uploadedAttachments = await Promise.all(
        attachments.map(async (file) => ({
          name: file.name,
          url: await uploadMessageAttachment(file, "ticket"),
          type: "TicketAttachment",
        }))
      );

      const messageData = {
        ticketId: ticket?.id,
        message: newMessage, 
        attachments: uploadedAttachments,
      };

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

  const handleImagePreview = (url: string) => {
    setShowImagePreview(url);
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return <FileText className="text-red-500" size={20} />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <Image className="text-blue-500" size={20} />;
      case "mp4":
      case "mov":
        return <Video className="text-purple-500" size={20} />;
      case "zip":
      case "rar":
        return <Archive className="text-orange-500" size={20} />;
      default:
        return <FileIcon className="text-gray-500" size={20} />;
    }
  };

  // Helper function to determine if file is an image
  const isImageFile = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    return ["jpg", "jpeg", "png", "gif"].includes(extension || "");
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


  // Group messages by date for better organization
  const groupedMessages = ticket?.messages ? groupMessagesByDate(ticket.messages) : [];

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingComponent />
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
              onClick={() => navigate("/dashboard/support")}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">
                  Ticket #{ticket.ticketNo}
                </h1>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                    ticket.status
                  )}`}
                >
                  {ticket.status}
                </span>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(
                    ticket.priority
                  )}`}
                >
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative">
              <div
                ref={messagesContainerRef}
                className="max-h-[60vh] overflow-y-auto pr-4 mb-2
                  scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 
                  hover:scrollbar-thumb-gray-400 transition-colors"
              >
                <div className="space-y-8">
                  {groupedMessages.map((group, groupIndex) => (
                    <div key={groupIndex} className="space-y-6">
                      {/* Date Header */}
                      <div className="flex items-center justify-center my-4">
                        <div className="bg-gray-100 rounded-full px-4 py-1 text-sm text-gray-500 flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{new Date(group.date).toLocaleDateString(undefined, {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}</span>
                        </div>
                      </div>
                      
                      {group.messages.map((message, index) => {
                        // Check if this is a consecutive message from the same sender
                        const isSameSenderAsPrevious = index > 0 && 
                          message.isStaff === group.messages[index - 1].isStaff;
                        
                        // Time difference with previous message
                        const timeGap = index > 0 ? 
                          new Date(message.createdAt).getTime() - new Date(group.messages[index - 1].createdAt).getTime() : 0;
                        
                        // Show sender info for first message or if time gap > 5 min
                        const showSenderInfo = !isSameSenderAsPrevious || timeGap > 5 * 60 * 1000;
                        
                        return (
                          <div
                            key={message.id}
                            className={`flex gap-4 group ${
                              !message.isStaff ? "flex-row-reverse" : ""
                            }`}
                          >
                            {/* Avatar - only show for first message in a sequence */}
                            {showSenderInfo ? (
                              <div className="flex-shrink-0">
                                <div className={`w-10 h-10 rounded-full 
                                  ${!message.isStaff ? "bg-[--primary]/10" : "bg-gray-100"} 
                                  flex items-center justify-center`}
                                >
                                  <User className={`w-5 h-5 
                                    ${!message.isStaff ? "text-[--primary]" : "text-gray-500"}`} 
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="w-10 flex-shrink-0"></div> // Spacer to maintain alignment
                            )}
                            
                            <div className={`flex-1 max-w-[80%] ${!message.isStaff ? "items-end text-right" : ""}`}>
                              {/* Sender info - only show for first message in a sequence */}
                              {showSenderInfo && (
                                <div className={`flex items-center gap-2 mb-1 ${!message.isStaff ? "justify-end" : ""}`}>
                                  <span className="font-medium">
                                    {message.isStaff ? "Support Team" : "You"}
                                  </span>
                                  {message.isStaff && (
                                    <span className="px-2 py-0.5 text-xs bg-blue-50 text-blue-600 rounded-full">
                                      Staff
                                    </span>
                                  )}
                                </div>
                              )}
                              
                              {/* Message bubble */}
                              <div
                                className={`relative group ${
                                  !message.isStaff
                                    ? "bg-[--primary]/5 text-[--primary] border border-[--primary]/10"
                                    : "bg-gray-50 text-gray-700 border border-gray-100"
                                } rounded-lg p-4 mb-1 hover:shadow-sm transition-shadow`}
                              >
                                {/* If this is a reply to another message */}
                                {message.message.startsWith("Replying to:") && (
                                  <div className="text-xs italic text-gray-500 pb-2 mb-2 border-b border-gray-200">
                                    {message.message.split("\n\n")[0]}
                                  </div>
                                )}
                                
                                <p className={`whitespace-pre-wrap ${!message.isStaff ? "text-left" : ""}`}>
                                  {message.message.startsWith("Replying to:") 
                                    ? message.message.split("\n\n")[1] // Show only the actual message content
                                    : message.message}
                                </p>
                                
                                <div className="absolute bottom-2 right-2 flex items-center gap-1 text-xs text-gray-400">
                                  {formatRelativeTime(new Date(message.createdAt))}
                                </div>

                                {/* Message Actions on Hover */}
                                <div className={`absolute top-2 ${!message.isStaff ? "left-2" : "right-2"} hidden group-hover:flex items-center gap-2`}>
                                  <button 
                                    className="p-1 hover:bg-gray-200 rounded-full tooltip tooltip-left"
                                    data-tip="Copy"
                                    onClick={() => handleCopyMessage(message.message)}
                                  >
                                    <Copy size={14} />
                                  </button>
                                </div>
                              </div>

                              {/* Attachments with improved display */}
                              {message.attachments.length > 0 && (
                                <div className={`mt-2 flex flex-wrap gap-2 ${!message.isStaff ? "justify-end" : ""}`}>
                                  {message.attachments.map((attachment, index) => (
                                    isImageFile(attachment.name) ? (
                                      // Image preview for image files
                                      <div 
                                        key={index} 
                                        className="relative group cursor-pointer"
                                        onClick={() => handleImagePreview(attachment.url)}
                                      >
                                        <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                                          <img 
                                            src={attachment.url} 
                                            alt={attachment.name}
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
                                          <Download size={18} className="text-white opacity-0 group-hover:opacity-100" />
                                        </div>
                                      </div>
                                    ) : (
                                      // Standard file attachment
                                      <a
                                        key={index}
                                        href={attachment.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 
                                          rounded-lg transition-all group border border-gray-100"
                                      >
                                        {getFileIcon(attachment.name)}
                                        <span className="text-sm text-gray-600">
                                          {attachment.name.length > 20 
                                            ? attachment.name.substring(0, 17) + '...' 
                                            : attachment.name}
                                        </span>
                                        <Download
                                          size={14}
                                          className="text-gray-400 opacity-0 group-hover:opacity-100 
                                          transition-opacity"
                                        />
                                      </a>
                                    )
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              
              {/* Scroll to bottom button */}
              {showScrollToBottom && (
                <button 
                  onClick={handleScrollToBottom}
                  className="absolute bottom-4 right-4 p-2 bg-gray-700 text-white rounded-full shadow-lg hover:bg-gray-600 transition-colors z-10"
                >
                  <ArrowDown size={20} />
                </button>
              )}
              
              {/* Image Preview Modal */}
              {showImagePreview && (
                <div 
                  className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                  onClick={() => setShowImagePreview(null)}
                >
                  <div className="relative max-w-4xl max-h-screen p-4">
                    <button 
                      className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 text-white rounded-full"
                      onClick={() => setShowImagePreview(null)}
                    >
                      <X size={20} />
                    </button>
                    <img 
                      src={showImagePreview} 
                      alt="Preview" 
                      className="max-w-full max-h-[90vh] object-contain"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Reply Box */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">            
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-gray-200 rounded-lg p-4 transition-all hover:border-[--primary]/30"
              >
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
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg group border border-gray-100"
                      >
                        {getFileIcon(file.name)}
                        <span className="text-sm text-gray-600">
                          {file.name.length > 25 ? file.name.substring(0, 22) + '...' : file.name}
                        </span>
                        <button
                          onClick={() => removeAttachment(index)}
                          className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
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
                    disabled={(!newMessage.trim() && attachments.length === 0) || isUploading}
                    className="inline-flex items-center gap-2 px-6 py-2 bg-[--primary] text-white 
                      rounded-lg hover:bg-[--primary]/90 transition-colors disabled:opacity-50 
                      disabled:cursor-not-allowed"
                  >
                    <Send size={18} />
                    Send Reply
                  </button>
                </div>
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
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm 
                    font-medium ${getStatusColor(ticket.status)}`}
                  >
                    {ticket.status}
                  </span>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">Priority</p>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm 
                    font-medium ${getPriorityColor(ticket.priority)}`}
                  >
                    <AlertCircle size={14} />
                    {ticket.priority} Priority
                  </span>
                </div>
              </div>
            </div>
            
            {/* Help Instructions */}
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="font-medium text-blue-900">Support Information</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Our support team typically responds within 24 hours during business days. 
                    Please provide as much detail as possible to help us resolve your issue quickly.
                  </p>
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