import { useEffect, useState } from "react";
import AdminDashboardLayout from "../../components/layout/AdminDashboardLayout";
import instance from "../../http/instance";
import { 
  Bell, Plus, Search, Eye, Trash, Menu, X, Clock, 
  AlertCircle, CheckCircle2, ArrowUpCircle, Building2
} from 'lucide-react';
import CreateTaskPage from "./CreateTaskPage";
import TaskDetailPage from "./TaskDetailPage";
import { Task } from "../../types/types";
import { useNavigate } from "react-router-dom";

const getStatusColor = (status: string) => {
  switch (status) {
    case 'OPEN':
      return 'bg-yellow-100 text-yellow-800';
    case 'IN_PROGRESS':
      return 'bg-[#EEF2FF] text-[#1649FF]';
    case 'COMPLETED':
      return 'bg-[#E8FFF3] text-[#9EE248]';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'HIGH':
      return 'bg-red-100 text-red-600';
    case 'MEDIUM':
      return 'bg-[#EEF2FF] text-[#1649FF]';
    case 'LOW':
      return 'bg-[#E8FFF3] text-[#9EE248]';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'GENERAL':
      return 'bg-purple-100 text-purple-600';
    case 'LEGAL':
      return 'bg-blue-100 text-blue-600';
    case 'ADMINISTRATIVE':
      return 'bg-orange-100 text-orange-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days < 0) {
    return 'Overdue';
  } else if (days === 0) {
    return 'Due Today';
  } else if (days === 1) {
    return 'Due Tomorrow';
  } else {
    return `Due in ${days} days`;
  }
};


export default function AdminTasks() {

  const [tasks, setTasks] = useState<Task[]>([]);

  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dueDate');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

const navigate=useNavigate();
  const fetchTasks = async () => {
    const res = await instance.get("/admin/task/all");
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (isCreating) {
    return <CreateTaskPage onBack={() => setIsCreating(false)} />;
  }

  if (selectedTaskId) {
    return <TaskDetailPage/>;
  }

  const filteredTasks = tasks
    .filter(task => {
      if (selectedFilter === 'OPEN' && task.status !== 'OPEN') return false;
      if (selectedFilter === 'IN_PROGRESS' && task.status !== 'IN_PROGRESS') return false;
      if (selectedFilter === 'COMPLETED' && task.status !== 'COMPLETED') return false;
      
      const searchTerm = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(searchTerm) ||
        task.description.toLowerCase().includes(searchTerm) ||
        task.type.toLowerCase().includes(searchTerm)
      );
    })
    .sort((a, b) => {
      switch ( sortBy) {
        case 'dueDate':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'priority':
          const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
          return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });


  return (
    <AdminDashboardLayout>
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl lg:text-2xl font-semibold text-[#333333]">Tasks</h1>
          <p className="text-sm text-gray-500">Manage and track tasks</p>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-[#1649FF] text-white rounded-lg flex items-center hover:bg-blue-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Task
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

      {/* Task Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-[#1649FF]" />
            </div>
            <span className="text-xs px-2 py-1 bg-[#E8FFF3] text-[#9EE248] rounded-full">+2 new</span>
          </div>
          <h3 className="text-2xl font-semibold mb-1">5</h3>
          <p className="text-sm text-gray-500">Open Tasks</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-[#1649FF]" />
            </div>
            <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full">3 due soon</span>
          </div>
          <h3 className="text-2xl font-semibold mb-1">8</h3>
          <p className="text-sm text-gray-500">In Progress</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-[#1649FF]" />
            </div>
            <span className="text-xs px-2 py-1 bg-[#E8FFF3] text-[#9EE248] rounded-full">+5 today</span>
          </div>
          <h3 className="text-2xl font-semibold mb-1">12</h3>
          <p className="text-sm text-gray-500">Completed Tasks</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
              <ArrowUpCircle className="w-6 h-6 text-[#1649FF]" />
            </div>
            <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full">2 high priority</span>
          </div>
          <h3 className="text-2xl font-semibold mb-1">4</h3>
          <p className="text-sm text-gray-500">Priority Tasks</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        {/* Mobile Filter Toggle */}
        <div className="flex lg:hidden justify-between items-center w-full">
          <button
            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
            className="px-4 py-2 bg-white text-gray-600 rounded-lg border border-gray-200"
          >
            {isFilterMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            <span className="ml-2">Filters</span>
          </button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1649FF]"
          >
            <option value="dueDate">Sort by: Due Date</option>
            <option value="priority">Sort by: Priority</option>
            <option value="recent">Sort by: Recent</option>
          </select>
        </div>

        {/* Filter Buttons */}
        <div className={`flex flex-wrap gap-2 ${isFilterMenuOpen ? 'block' : 'hidden'} lg:flex`}>
          {['ALL', 'OPEN', 'IN_PROGRESS', 'COMPLETED'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedFilter === filter
                  ? 'bg-[#1649FF] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {filter === 'ALL' ? 'All Tasks' : filter.charAt(0) + filter.slice(1).toLowerCase().replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Search and Sort - Desktop */}
        <div className="hidden lg:flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-[#1649FF]"
            />
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1649FF]"
          >
            <option value="dueDate">Sort by: Due Date</option>
            <option value="priority">Sort by: Priority</option>
            <option value="recent">Sort by: Recent</option>
          </select>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden relative">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1649FF]"
          />
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Table Header - Desktop */}
        <div className="hidden lg:grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50 text-sm font-medium">
          <div className="col-span-4">Task</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Priority</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-1">Due Date</div>
          <div className="col-span-1">Actions</div>
        </div>

        {/* Tasks */}
        <div className="divide-y divide-gray-200">
          {filteredTasks.map((task) => (
            <div key={task.id} className="p-4">
              {/* Desktop View */}
              <div className="hidden lg:grid grid-cols-12 gap-4 items-center">
                <div className="col-span-4">
                  <div className="flex items-center">
                    <Building2 className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-gray-500 truncate">{task.description}</p>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(task.type)}`}>
                    {task.type}
                  </span>
                </div>
                <div className="col-span-1">
                  <span className="text-sm text-gray-600">{formatDate(task.dueDate)}</span>
                </div>
                <div className="col-span-1 flex space-x-2">
                  <button 
                    onClick={() => navigate(`/admin/tasks/details`, { state: { taskId: task.id } })}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Mobile View */}
              <div className="lg:hidden space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-gray-500">{task.description}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setSelectedTaskId(task.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(task.type)}`}>
                    {task.type}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>{formatDate(task.dueDate)}</span>
                  <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-6 gap-4">
        <p className="text-sm text-gray-600 text-center lg:text-left">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </p>
        <div className="flex justify-center space-x-2">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            Previous
          </button>
          <button className="px-4 py-2 bg-[#1649FF] text-white rounded-lg">1</button>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            2
          </button>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            3
          </button>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
