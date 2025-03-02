import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Building2,
  Calendar,
  Clock,
  Paperclip,
  Send,
  X,
  Bold,
  Italic,
  List,
  Link as LinkIcon,
} from "lucide-react";
import { uploadMessageAttachment } from "../../utils/fileUpload";
import instance from "../../http/instance";
import toast from "react-hot-toast";
import AdminDashboardLayout from "../../components/layout/AdminDashboardLayout";

interface Message {
  id: string;
  taskId: string;
  userId: string;
  message: string;
  isStaff: boolean;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  attachments: {
    id: string;
    name: string;
    url: string;
    type: string;
    uploadedBy: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  }[];
}

interface Task {
  id: string;
  title: string;
  description: string;
  Icon: string;
  status: "OPEN" | "IN_PROGRESS" | "COMPLETED";
  priority: "HIGH" | "MEDIUM" | "LOW";
  type: string;
  companyId: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  assignedCompany: {
    id: string;
    companyName: string;
  };
  attachments: any[];
  messages: Message[];
}

interface Attachment {
  name: string;
  url: string;
  type: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "OPEN":
      return "bg-yellow-100 text-yellow-800";
    case "IN_PROGRESS":
      return "bg-[#EEF2FF] text-[#1649FF]";
    case "COMPLETED":
      return "bg-[#E8FFF3] text-[#9EE248]";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "HIGH":
      return "bg-red-100 text-red-600";
    case "MEDIUM":
      return "bg-[#EEF2FF] text-[#1649FF]";
    case "LOW":
      return "bg-[#E8FFF3] text-[#9EE248]";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "GENERAL":
      return "bg-purple-100 text-purple-600";
    case "LEGAL":
      return "bg-blue-100 text-blue-600";
    case "ADMINISTRATIVE":
      return "bg-orange-100 text-orange-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 60) {
    return `${minutes}m ago`;
  } else if (hours < 24) {
    return `${hours}h ago`;
  } else if (days === 1) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString();
  }
};

export default function AdminTaskDetailPage() {
  const [task, setTask] = useState<Task | undefined>();
  const [newMessage, setNewMessage] = useState("");
  const [newAttachments, setNewAttachments] = useState<File[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchTaskDetails = async () => {
    setLoading(true);
    try {
      const response = await instance.get(
        `/admin/task/${location.state?.taskId}`
      );
      console.log("Task Details:", response.data);
      setTask(response.data);
    } catch (error) {
      console.error("Error fetching task details:", error);
      toast.error("Failed to load task details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskDetails();
  }, [location.state?.taskId]);

  const handleStatusChange = (newStatus: string) => {
    setTask((prev) =>
      prev ? { ...prev, status: newStatus as Task["status"] } : prev
    );
    // API çağrısı ekleyebilirsin
  };

  const handlePriorityChange = (newPriority: string) => {
    setTask((prev) =>
      prev ? { ...prev, priority: newPriority as Task["priority"] } : prev
    );
    // API çağrısı ekleyebilirsin
  };

  const handleSendMessage = async (e:any) => {
    e.preventDefault();
    if (!newMessage.trim() && newAttachments.length === 0) return;
    try {
      const attachment: Attachment[] = await Promise.all(
        newAttachments.map(async (file) => ({
          name: file.name,
          url: await uploadMessageAttachment(file, "task"),
          type: "TaskAttachment",
        }))
      );

      const messageData = {
        message: newMessage,
        attachments: attachment,
        taskId: task?.id,
        isStaff: true,
      };

      const res = await instance.post("/admin/task/add-message", messageData);
      console.log("Submitting message:", messageData);
      if (res) {
        toast.success("Message sent successfully");
      }
      await fetchTaskDetails();

      // Formu temizle
      setNewMessage("");
      setNewAttachments([]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setNewAttachments(Array.from(files));
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading || !task) {
    return (
      <main className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Loading task details...</p>
      </main>
    );
  }

  return (
    <AdminDashboardLayout>
      {/* Mobile Sidebar Overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleGoBack}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl lg:text-2xl font-semibold text-[#333333]">
              {task.title}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                  task.status
                )}`}
              >
                {task.status.replace("_", " ")}
              </span>
              <span
                className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(
                  task.priority
                )}`}
              >
                {task.priority}
              </span>
              <span
                className={`px-2 py-1 text-xs rounded-full ${getTypeColor(
                  task.type
                )}`}
              >
                {task.type}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {/* Mobile Sidebar Toggle */}
          <button
            className="lg:hidden px-3 py-1 text-sm border border-gray-200 rounded-lg"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            Details
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Description */}
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">Description</h2>
            <p className="text-gray-600">{task.description}</p>
            {task.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {task.attachments.map((attachment) => (
                            <a
                              key={attachment.id}
                              href={attachment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <Paperclip className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-600">
                                {attachment.name}
                              </span>
                            </a>
                          ))}
                        </div>
                      )}
          </section>

          {/* Messages Section */}
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">Messages</h2>
            {/* Scrollable container ekledim */}
            <div className="max-h-[60vh] overflow-y-auto overflow-x-hidden pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 transition-colors mb-6">
              <div className="space-y-6">
                {task.messages.map((message) => (
                  <div key={message.id} className="flex space-x-4">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${message.user.id}`}
                      alt={`${message.user.firstName} ${message.user.lastName}`}
                      className="w-10 h-10 rounded-full flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          <span className="font-medium">
                            {message.user.firstName} {message.user.lastName}
                          </span>
                          {message.isStaff && (
                            <span className="ml-2 px-2 py-0.5 text-xs bg-[#EEF2FF] text-[#1649FF] rounded-full">
                              Staff
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(message.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{message.message}</p>
                      {message.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {message.attachments.map((attachment) => (
                            <a
                              key={attachment.id}
                              href={attachment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <Paperclip className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-600">
                                {attachment.name}
                              </span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* New Message Form */}
            <form onSubmit={handleSendMessage}>
              <div className="border border-gray-200 rounded-lg">
                <div className="flex items-center p-2 border-b border-gray-200">
                  <button
                    type="button"
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    <LinkIcon className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full p-4 min-h-[100px] focus:outline-none resize-none"
                />
                {newAttachments.length > 0 && (
                  <div className="border-t border-gray-200 p-2 space-y-2">
                    {newAttachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded"
                      >
                        <div className="flex items-center">
                          <Paperclip className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">
                            {file.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setNewAttachments((prev) =>
                              prev.filter((_, i) => i !== index)
                            )
                          }
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between mt-4">
                <label className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200">
                  <Paperclip className="w-4 h-4 mr-2" />
                  <span>Attach Files</span>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                <button
                  type="submit"
                  className="flex items-center px-6 py-2 bg-[#1649FF] text-white rounded-lg hover:bg-blue-600"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 right-0 w-80 lg:w-auto lg:static bg-white lg:bg-transparent transform transition-transform duration-300 ease-in-out ${
            showSidebar ? "translate-x-0" : "translate-x-full"
          } lg:translate-x-0 z-50 overflow-y-auto lg:overflow-visible`}
        >
          <div className="space-y-6 p-4 lg:p-0">
            {/* Task Details */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium mb-4">Task Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Status
                  </label>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1649FF]"
                  >
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Priority
                  </label>
                  <select
                    value={task.priority}
                    onChange={(e) => handlePriorityChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1649FF]"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Due Date
                  </label>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Created
                  </label>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    {new Date(task.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Assigned Company */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium mb-4">Assigned Company</h2>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Building2 className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="font-medium">
                    {task.assignedCompany.companyName}
                  </p>
                  <p className="text-sm text-gray-500">
                    ID: {task.assignedCompany.id}
                  </p>
                </div>
              </div>
            </div>

            {/* Activity Stats */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium mb-4">Activity</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Total Messages</span>
                  <span className="font-medium">{task.messages.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Total Attachments</span>
                  <span className="font-medium">
                    {task.messages.reduce(
                      (acc, msg) => acc + msg.attachments.length,
                      0
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Last Updated</span>
                  <span className="font-medium">
                    {formatDate(task.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </AdminDashboardLayout>
  );
}
