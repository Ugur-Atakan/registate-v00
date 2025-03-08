import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdminDashboardLayout from "../../components/layout/AdminDashboardLayout";
import {
  ArrowLeft,
  Bell,
  Bold,
  Download,
  FileText,
  Italic,
  Link as LinkIcon,
  List,
  Paperclip,
  Send,
  User,
  X,
  Clock,
  Info,
  Search,
  Filter,
  Image,
  FileIcon,
  Video,
  Archive,
  CheckCircle2,
  MessageSquare,
  Users,
  MoreVertical,
  ChevronDown,
} from "lucide-react";
import instance from "../../http/instance";
import toast from "react-hot-toast";
import { uploadMessageAttachment } from "../../utils/fileUpload";
import Avvvatars from "avvvatars-react";

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
  status: "OPEN" | "IN_PROGRESS" | "CLOSED";
  priority: "HIGH" | "MEDIUM" | "LOW";
  isActivate: boolean;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    telephone: string | null;
    profileImage: string | null;
  };
}

const AdminTicketDetailsPage = () => {
  const [replyText, setReplyText] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [messageFilter, setMessageFilter] = useState<"all" | "admin" | "user">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showAssignMenu, setShowAssignMenu] = useState(false);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const fetchTicketDetails = async () => {
    if (!location.state?.ticketId) {
      toast.error("Ticket ID is missing");
      return;
    }
    try {
      const response = await instance.get(
        `/admin/ticket/${location.state.ticketId}/details`
      );
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

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (newMessage.trim()) {
        localStorage.setItem(
          `ticket_draft_${location.state?.ticketId}`,
          newMessage
        );
        setIsDraftSaved(true);
        setTimeout(() => setIsDraftSaved(false), 3000);
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [newMessage, location.state?.ticketId]);

  // Load saved draft on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(
      `ticket_draft_${location.state?.ticketId}`
    );
    if (savedDraft) {
      setNewMessage(savedDraft);
    }
  }, [location.state?.ticketId]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
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
        isStaff: true,
      };

      await instance.post(`/admin/support/add-message-to-ticket`, messageData);
      toast.success("Message sent successfully");
      await fetchTicketDetails();
      setNewMessage("");
      setAttachments([]);
      localStorage.removeItem(`ticket_draft_${location.state?.ticketId}`);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await instance.post(`/admin/ticket/${ticket?.id}/edit`, {
        status: newStatus,
        priority: ticket?.priority,
      });
      await fetchTicketDetails();
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handlePriorityChange = async (newPriority: string) => {
    setTicket((prev) =>
      prev
        ? {
            ...prev,
            priority: newPriority as Ticket["priority"],
          }
        : null
    );
    try {
      await instance.post(`/admin/ticket/${ticket?.id}/edit`, {
        status: ticket?.status,
        priority:newPriority,
      });
      await fetchTicketDetails();
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error("Failed to update status");
    }
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

  const filteredMessages = ticket?.messages.filter((message) => {
    const matchesFilter =
      messageFilter === "all" ||
      (messageFilter === "admin" && message.isStaff) ||
      (messageFilter === "user" && !message.isStaff);

    const matchesSearch = message.message
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: Ticket["status"]) => {
    switch (status) {
      case "CLOSED":
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

  if (loading || !ticket) {
    return (
      <AdminDashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin w-8 h-8 border-4 border-[--primary] border-t-transparent rounded-full"></div>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <main className="lg:p-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{ticket.subject}</h1>
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
              <p className="text-gray-600 mt-1"> Ticket #{ticket.ticketNo}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowAssignMenu(!showAssignMenu)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <Users size={18} />
                <span>Assign</span>
                <ChevronDown size={16} />
              </button>
              {showAssignMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                  {/* Add your team members list here */}
                  <button className="w-full px-4 py-2 text-left hover:bg-gray-50">
                    John Doe
                  </button>
                  <button className="w-full px-4 py-2 text-left hover:bg-gray-50">
                    Jane Smith
                  </button>
                </div>
              )}
            </div>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Bell size={20} />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <MoreVertical size={20} />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Message Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-grow max-w-md">
                  <Search
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search in conversation..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                      focus:ring-2 focus:ring-[--primary] focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter size={18} className="text-gray-400" />
                  <select
                    value={messageFilter}
                    onChange={(e) =>
                      setMessageFilter(
                        e.target.value as "all" | "admin" | "user"
                      )
                    }
                    className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none 
                      focus:ring-2 focus:ring-[--primary] focus:border-transparent"
                  >
                    <option value="all">All Messages</option>
                    <option value="admin">Admin Replies</option>
                    <option value="user">User Messages</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div
                className="max-h-[60vh] overflow-y-auto overflow-x-hidden pr-4 
                scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 
                hover:scrollbar-thumb-gray-400 transition-colors"
              >
                <div className="space-y-6">
                  {filteredMessages?.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-4 group ${
                        message.isStaff ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-500" />
                        </div>
                      </div>
                      <div
                        className={`flex-1 max-w-[80%] ${
                          message.isStaff ? "items-end" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">
                            {message.isStaff
                              ? "Support Team"
                              : `${ticket.user.firstName} ${ticket.user.lastName}`}
                          </span>
                          {message.isStaff && (
                            <span className="px-2 py-0.5 text-xs bg-blue-50 text-blue-600 rounded-full">
                              Staff
                            </span>
                          )}
                        </div>
                        <div
                          className={`relative group ${
                            message.isStaff
                              ? "bg-[--primary]/5 text-[--primary]"
                              : "bg-gray-50 text-gray-700"
                          } rounded-lg p-4`}
                        >
                          <p className="whitespace-pre-wrap">
                            {message.message}
                          </p>
                          <span className="absolute bottom-2 right-2 text-xs text-gray-400">
                            {new Date(message.createdAt).toLocaleTimeString()}
                          </span>

                          {/* Message Actions on Hover */}
                          <div className="absolute top-2 right-2 hidden group-hover:flex items-center gap-2">
                            <button className="p-1 hover:bg-gray-200 rounded-full">
                              <MessageSquare size={14} />
                            </button>
                            <button className="p-1 hover:bg-gray-200 rounded-full">
                              <MoreVertical size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Attachments */}
                        {message.attachments.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {message.attachments.map((attachment, index) => (
                              <a
                                key={index}
                                href={attachment.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 
                                  rounded-lg transition-all group"
                              >
                                {getFileIcon(attachment.name)}
                                <span className="text-sm text-gray-600">
                                  {attachment.name}
                                </span>
                                <Download
                                  size={14}
                                  className="text-gray-400 opacity-0 group-hover:opacity-100 
                                  transition-opacity"
                                />
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

            {/* Reply Box */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-gray-200 rounded-lg p-4 transition-all
                  hover:border-[--primary]/30"
              >
                {/* Formatting Toolbar */}
                <div className="flex items-center gap-2 p-2 border-b border-gray-200 mb-4">
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <Bold size={18} />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <Italic size={18} />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <LinkIcon size={18} />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <List size={18} />
                  </button>
                </div>

                {/* Text Area */}
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your reply here..."
                  className="w-full p-4 min-h-[150px] focus:outline-none resize-y"
                />

                {/* Attachments Preview */}
                {attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4 p-4 bg-gray-50 rounded-lg">
                    {attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg group"
                      >
                        {getFileIcon(file.name)}
                        <span className="text-sm">{file.name}</span>
                        <button
                          onClick={() => removeAttachment(index)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X
                            size={14}
                            className="text-gray-400 hover:text-red-500"
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-4">
                    <label
                      className="cursor-pointer flex items-center gap-2 text-gray-500 
                      hover:text-[--primary] transition-colors"
                    >
                      <Paperclip size={20} />
                      <span className="text-sm">Attach files</span>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    {isDraftSaved && (
                      <span className="text-sm text-green-600 flex items-center gap-1">
                        <CheckCircle2 size={14} />
                        Draft saved
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        localStorage.setItem(
                          `ticket_draft_${ticket.id}`,
                          newMessage
                        );
                        toast.success("Draft saved");
                      }}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Save Draft
                    </button>
                    <button
                      onClick={handleSubmitMessage}
                      disabled={
                        (!newMessage.trim() && attachments.length === 0) ||
                        isUploading
                      }
                      className="flex items-center gap-2 px-6 py-2 bg-[--primary] text-white rounded-lg
                        hover:bg-[--primary]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={18} />
                      Send Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ticket Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Ticket Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-2">
                    Status
                  </label>
                  <select
                    value={ticket.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none 
                      focus:ring-2 focus:ring-[--primary] focus:border-transparent"
                  >
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="CLOSED">Resolved</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-500 mb-2">
                    Priority
                  </label>
                  <select
                    value={ticket.priority}
                    onChange={(e) => handlePriorityChange(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none 
                      focus:ring-2 focus:ring-[--primary] focus:border-transparent"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <label className="block text-sm text-gray-500 mb-2">
                    Category
                  </label>
                  <div className="flex items-center gap-2 text-gray-700">
                    <MessageSquare size={16} className="text-gray-400" />
                    {ticket.category}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <label className="block text-sm text-gray-500 mb-2">
                    Created
                  </label>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock size={16} className="text-gray-400" />
                    {new Date(ticket.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <label className="block text-sm text-gray-500 mb-2">
                    Last Updated
                  </label>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock size={16} className="text-gray-400" />
                    {new Date(ticket.updatedAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">
                Customer Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {ticket.user.profileImage ? (
                    <img
                      src={ticket.user.profileImage}
                      alt={`${ticket.user.firstName} ${ticket.user.lastName}`}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <Avvvatars value={ticket.user.email} style="character" />
                  )}
                  <div>
                    <p className="font-medium">
                      {ticket.user.firstName} {ticket.user.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{ticket.user.email}</p>
                  </div>
                </div>
                {ticket.user.telephone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-sm">Phone:</span>
                    <span>{ticket.user.telephone}</span>
                  </div>
                )}
                <button
                  onClick={() =>
                    navigate(`/admin/users/`, {
                      state: { userId: ticket.user.id },
                    })
                  }
                  className="mt-4 px-4 py-2 bg-[--primary] text-white rounded-lg hover:bg-[--primary]/90 transition-colors"
                >
                  View Profile
                </button>
              </div>
            </div>

            {/* Help Text */}
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Info
                  className="text-blue-600 flex-shrink-0 mt-0.5"
                  size={20}
                />
                <div>
                  <h4 className="font-medium text-blue-900">Quick Tips</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Use quick replies and saved responses to handle common
                    inquiries efficiently. Update ticket status promptly to keep
                    customers informed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AdminDashboardLayout>
  );
};

export default AdminTicketDetailsPage;
