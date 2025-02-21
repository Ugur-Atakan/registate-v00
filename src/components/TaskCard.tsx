import { Task } from "../types/types";
import { Clock, AlertCircle, Calendar, ArrowUpRight, CheckCircle2, ListTodo } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onclick: (id: string) => void;
}

const TaskCard = ({ task, onclick }: TaskCardProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'text-red-600 bg-red-50 border-red-100';
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-50 border-yellow-100';
      case 'LOW':
        return 'text-green-600 bg-green-50 border-green-100';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600 bg-green-50 border-green-100';
      case 'IN_PROGRESS':
        return 'text-blue-600 bg-blue-50 border-blue-100';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle2 size={16} />;
      case 'IN_PROGRESS':
        return <Clock size={16} />;
      default:
        return <AlertCircle size={16} />;
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

  const daysLeft = getDaysUntilDue(task.dueDate);
  const isUrgent = daysLeft <= 7 && task.status !== 'COMPLETED';

  return (
    <div 
      onClick={() => onclick(task.id)}
      className={`group bg-white rounded-xl border hover:shadow-lg transition-all duration-300 cursor-pointer
        ${isUrgent ? 'border-red-200' : 'border-gray-200 hover:border-[--primary]/30'}`}
    >
      <div className="p-6">
        {/* Header Section */}
        <div className="flex items-start gap-4">
          {/* Task Icon */}
          <div className={`p-3 rounded-xl flex-shrink-0 ${
            isUrgent ? 'bg-red-50' : task.status === 'COMPLETED' ? 'bg-green-50' : 'bg-[--primary]/10'
          }`}>
            <ListTodo className={`w-5 h-5 ${
              isUrgent ? 'text-red-600' : task.status === 'COMPLETED' ? 'text-green-600' : 'text-[--primary]'
            }`} />
          </div>

          {/* Task Info and Badges */}
          <div className="flex-1 min-w-0">
            {/* Title and Status Row */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[--primary] 
                transition-colors">
                {task.title}
              </h3>
              
              {/* Status and Priority Badges */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border 
                  ${getStatusColor(task.status)}`}>
                  {getStatusIcon(task.status)}
                  <span className="text-sm font-medium whitespace-nowrap">{task.status}</span>
                </div>

                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border 
                  ${getPriorityColor(task.priority)}`}>
                  <AlertCircle size={16} />
                  <span className="text-sm font-medium whitespace-nowrap">
                    {task.priority}
                  </span>
                </div>
              </div>
            </div>

            {/* Description and Due Date */}
            <div className="space-y-3">
              <p className="text-gray-600 line-clamp-2">{task.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Due Date */}
                  <div className={`flex items-center gap-2 text-sm ${
                    isUrgent ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    <Calendar size={16} />
                    <span>Due {formatDate(task.dueDate)}</span>
                  </div>

                  {/* Days Left */}
                  {task.status !== 'COMPLETED' && (
                    <div className={`text-sm font-medium ${
                      isUrgent ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      ({daysLeft} days left)
                    </div>
                  )}
                </div>

                {/* Arrow Icon */}
                <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-[--primary] 
                  transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;