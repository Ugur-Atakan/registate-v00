import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  ListTodo, 
  Search, 
  Clock, 
  AlertCircle, 
  Calendar,
  ArrowUpRight,
  CheckCircle2,
  MoreVertical,
  PlayCircle,
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { getCompanyTasks } from '../../http/requests/companyRequests';
import LoadingComponent from '../../components/Loading';

interface Task {
  id: string;
  title: string;
  description: string;
  Icon: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  type: 'GENERAL' | 'LEGAL' | 'ADMINISTRATIVE';
  companyId: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

const Tasks = () => {
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const navigate = useNavigate();



  useEffect(() => {
    const fetchTasks=async()=>{
      try {
        setLoading(true);
        const tasks= await getCompanyTasks();
        setTasks(tasks);
        setLoading(false);
      } catch (error:any) {
        setLoading(false);
        console.error('Error fetching company tasks:', error);
      }
    }
    fetchTasks();
  }, []);

  const activeTasks = tasks.filter(task => 
    task.status !== 'COMPLETED' &&
    (searchTerm === '' || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedPriorities.length === 0 || selectedPriorities.includes(task.priority))
  );

  const completedTasks = tasks.filter(task => 
    task.status === 'COMPLETED' &&
    (searchTerm === '' || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedPriorities.length === 0 || selectedPriorities.includes(task.priority))
  );

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'IN_PROGRESS':
        return <PlayCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'IN_PROGRESS':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: Task['status']) => {
    switch (status) {
      case 'COMPLETED':
        return 'Completed';
      case 'IN_PROGRESS':
        return 'In Progress';
      default:
        return 'Open';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'MEDIUM':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'LOW':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: Task['priority']) => {
    switch (priority) {
      case 'HIGH':
        return <AlertCircle className="w-4 h-4" />;
      case 'MEDIUM':
        return <Clock className="w-4 h-4" />;
      case 'LOW':
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDueDateColor = (daysLeft: number) => {
    if (daysLeft <= 7) return 'text-red-600';
    if (daysLeft <= 14) return 'text-amber-600';
    return 'text-emerald-600';
  };

  const togglePriority = (priority: string) => {
    setSelectedPriorities(prev => 
      prev.includes(priority)
        ? prev.filter(p => p !== priority)
        : [...prev, priority]
    );
  };

  const renderTask = (task: Task) => {
    const daysLeft = getDaysUntilDue(task.dueDate);
    const isUrgent = daysLeft <= 7 && task.status !== 'COMPLETED';

    return (
      <div
        key={task.id}
        onClick={() => navigate(`/dashboard/tasks/details`, { state: { taskId: task.id } })}
        className={`bg-white rounded-xl shadow-sm border transition-all duration-200 
          hover:shadow-md cursor-pointer ${
          isUrgent ? 'border-red-200' : 'border-gray-200'
        }`}
      >
        <div className="p-4 sm:p-6">
          {/* Task Header - Always Visible */}
          <div className="flex items-start gap-3 mb-4">
            <div className={`p-2 rounded-lg flex-shrink-0 ${
              isUrgent ? 'bg-red-50' : task.status === 'COMPLETED' ? 'bg-emerald-50' : 'bg-[--primary]/10'
            }`}>
              <ListTodo className={`w-5 h-5 ${
                isUrgent ? 'text-red-600' : task.status === 'COMPLETED' ? 'text-emerald-600' : 'text-[--primary]'
              }`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 mb-1">{task.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
            </div>
          </div>

          {/* Task Metadata - Responsive Layout */}
          <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
            {/* Status and Priority Badges */}
            <div className="flex flex-wrap gap-2">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm 
                font-medium border ${getStatusColor(task.status)}`}>
                {getStatusIcon(task.status)}
                <span>{getStatusLabel(task.status)}</span>
              </div>

              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm 
                font-medium border ${getPriorityColor(task.priority)}`}>
                {getPriorityIcon(task.priority)}
                <span>{task.priority}</span>
              </div>
            </div>

            {/* Due Date or Completion Date */}
            {task.status !== 'COMPLETED' ? (
              <div className={`flex items-center gap-2 text-xs sm:text-sm ${getDueDateColor(daysLeft)}`}>
                <Calendar size={16} className="flex-shrink-0" />
                <span className="whitespace-nowrap">Due {formatDate(task.dueDate)}</span>
                <span className="font-medium whitespace-nowrap">
                  ({daysLeft} days left)
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                <CheckCircle2 size={16} className="flex-shrink-0" />
                <span className="whitespace-nowrap">Completed {formatDate(task.updatedAt)}</span>
              </div>
            )}

            {/* Actions - Right Aligned on Desktop */}
            <div className="flex items-center gap-2 sm:ml-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle menu open
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <MoreVertical size={20} />
              </button>
              <ArrowUpRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
      
          <LoadingComponent />;
         
      
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Tasks</h1>
          <p className="text-gray-600">
            Manage and track your company's tasks and requirements
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                focus:ring-2 focus:ring-[--primary] focus:border-transparent"
            />
          </div>

          {/* Filter Chips - Scrollable on Mobile */}
          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <div className="flex items-center gap-2 min-w-max">
              <span className="text-sm font-medium text-gray-500 whitespace-nowrap">Priority:</span>
              {['HIGH', 'MEDIUM', 'LOW'].map((priority) => (
                <button
                  key={priority}
                  onClick={() => togglePriority(priority)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium 
                    whitespace-nowrap transition-colors duration-200 ${
                    selectedPriorities.includes(priority)
                      ? getPriorityColor(priority as Task['priority'])
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {getPriorityIcon(priority as Task['priority'])}
                  <span>{priority}</span>
                  {selectedPriorities.includes(priority) && (
                    <X size={14} className="ml-1" onClick={(e) => {
                      e.stopPropagation();
                      togglePriority(priority);
                    }} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Tasks */}
        <div className="space-y-4 mb-8">
          {activeTasks.length > 0 ? (
            activeTasks.map(renderTask)
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
              <ListTodo className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No active tasks</h3>
              <p className="text-gray-500">
                {searchTerm || selectedPriorities.length > 0
                  ? "Try adjusting your filters"
                  : "You don't have any active tasks at the moment"}
              </p>
            </div>
          )}
        </div>

        {/* Completed Tasks Section */}
        {completedTasks.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <button
              onClick={() => setShowCompletedTasks(!showCompletedTasks)}
              className="w-full px-4 sm:px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-emerald-600" size={20} />
                <span className="font-medium">Completed Tasks</span>
                <span className="text-sm text-gray-500">({completedTasks.length})</span>
              </div>
              {showCompletedTasks ? (
                <ChevronDown className="text-gray-400" size={20} />
              ) : (
                <ChevronRight className="text-gray-400" size={20} />
              )}
            </button>

            <div className={`space-y-4 transition-all duration-300 ease-in-out overflow-hidden
              ${showCompletedTasks ? 'max-h-[2000px] p-4' : 'max-h-0'}`}>
              {completedTasks.map(renderTask)}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Tasks;