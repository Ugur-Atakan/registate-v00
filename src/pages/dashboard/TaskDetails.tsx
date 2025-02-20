import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  ArrowLeft,
  Clock,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Paperclip,
  Send,
  FileText,
  Download,
  User,
  MessageSquare
} from "lucide-react";
import toast from "react-hot-toast";
import { getTaskDetails } from "../../http/requests/companyRequests";
import instance from "../../http/instance";

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

const TaskDetails = () => {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTaskDetails = async () => {
      setLoading(true);
      try {
        const task = await getTaskDetails(location.state?.taskId);
        setTask(task);
      } catch (error) {
        console.error("Error fetching task details:", error);
        toast.error("Failed to load task details");
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [location.state?.taskId]);

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

    setSubmitting(true);
    try {
      // In production, this would be an API call  this will be connect supabase
      const messageData = {
        message: newMessage,
        attachments: attachments.map(file => ({
          name: file.name,
          url: URL.createObjectURL(file),
          type: file.type,
          taskId: task?.id
        })),
        taskId: task?.id,
        isStaff: false
      };

      const res = await instance.post("/tasks/add-message", messageData);
      console.log("Submitting message:", messageData);
      if (res) {
        toast.success("Message sent successfully");
      }

      // Clear form
      setNewMessage("");
      setAttachments([]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setSubmitting(false);
    }
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "HIGH":
        return "text-red-600 bg-red-50";
      case "MEDIUM":
        return "text-yellow-600 bg-yellow-50";
      case "LOW":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "COMPLETED":
        return "text-green-600 bg-green-50";
      case "IN_PROGRESS":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse text-gray-500">Loading task details...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!task) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-500">Task not found</div>
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
              onClick={() => navigate("/dashboard/tasks")}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold">{task.title}</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                  <Clock size={16} />
                  {task.status}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
                  <AlertCircle size={16} />
                  {task.priority} Priority
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Description</h2>
              <p className="text-gray-600 whitespace-pre-wrap">{task.description}</p>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={16} />
                    <span>Due {formatDate(task.dueDate)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User size={16} />
                    <span>{task.assignedCompany.companyName}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Messages</h2>
              
              {/* Message List */}
              <div className="space-y-6 mb-6">
                {task.messages.map((message) => (
                  <div key={message.id} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">
                          {message.user.firstName} {message.user.lastName}
                        </span>
                        {message.isStaff && (
                          <span className="px-2 py-0.5 text-xs bg-blue-50 text-blue-600 rounded-full">
                            Staff
                          </span>
                        )}
                        <span className="text-sm text-gray-500">
                          {formatDate(message.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{message.message}</p>
                      
                      {/* Message Attachments */}
                      {message.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {message.attachments.map((attachment) => (
                            <a
                              key={attachment.id}
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

              {/* New Message Form */}
              <div className="space-y-4">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none 
                    focus:ring-2 focus:ring-[--primary] focus:border-transparent resize-none"
                  rows={4}
                />

                {/* Attachments Preview */}
                {attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2">
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
                          <AlertCircle size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 
                      rounded-lg cursor-pointer transition-colors">
                      <Paperclip size={20} />
                      <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <button
                    onClick={handleSubmitMessage}
                    disabled={submitting || (!newMessage.trim() && attachments.length === 0)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[--primary] text-white 
                      rounded-lg hover:bg-[--primary]/90 transition-colors disabled:opacity-50 
                      disabled:cursor-not-allowed"
                  >
                    <Send size={18} />
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Task Status</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500 block mb-2">Current Status</label>
                  <div className="flex flex-col gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm 
                      font-medium ${getStatusColor(task.status)}`}>
                      <Clock size={16} />
                      {task.status}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm 
                      font-medium ${getPriorityColor(task.priority)}`}>
                      <AlertCircle size={16} />
                      {task.priority} Priority
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <label className="text-sm text-gray-500 block mb-2">Task Type</label>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 
                    text-gray-600 rounded-full text-sm font-medium">
                    <MessageSquare size={16} />
                    {task.type}
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

export default TaskDetails;