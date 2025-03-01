import { useEffect, useState } from "react";
import AdminDashboardLayout from "../../components/layout/AdminDashboardLayout";
import instance from "../../http/instance";
import { 
  Bell, Plus, Search, Trash, Clock, 
  AlertCircle, CheckCircle2, ArrowUpDown, Filter, ChevronDown,
  Calendar, Info, ListTodo, Building2, ArrowUpRight
} from 'lucide-react';
import CreateTaskPage from "./CreateTaskPage";
import TaskDetailPage from "./TaskDetailPage";
import { Task } from "../../types/types";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const getStatusColor = (status: string) => {
  switch (status) {
    case 'OPEN':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'IN_PROGRESS':
      return 'bg-[#EEF2FF] text-[#1649FF] border-blue-200';
    case 'COMPLETED':
      return 'bg-[#E8FFF3] text-[#9EE248] border-green-200';
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'HIGH':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'MEDIUM':
      return 'bg-[#EEF2FF] text-[#1649FF] border-blue-200';
    case 'LOW':
      return 'bg-[#E8FFF3] text-[#9EE248] border-green-200';
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200';
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'GENERAL':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'LEGAL':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'ADMINISTRATIVE':
      return 'bg-orange-100 text-orange-700 border-orange-200';
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200';
  }
};

export default function AdminTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const companyId = location.state?.companyId;
  // if(companyId){ 
  //   return <div>Company Gönderildi</div>
  // }

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await instance.get("/admin/task/all");
      setTasks(response.data);
    } catch (error) {
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleBulkAction = async (action: 'delete' | 'complete') => {
    if (!selectedItems.length) return;
    
    try {
      if (action === 'delete') {
        await Promise.all(selectedItems.map(id => 
          instance.delete(`/admin/task/${id}`)
        ));
        toast.success("Selected tasks deleted successfully");
      } else {
        await Promise.all(selectedItems.map(id => 
          instance.patch(`/admin/task/${id}/complete`)
        ));
        toast.success("Tasks marked as completed");
      }
      fetchTasks();
      setSelectedItems([]);
    } catch (error) {
      toast.error("Failed to perform bulk action");
    }
  };

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const filteredTasks = tasks
    .filter(task => {
      if (selectedFilter !== 'ALL' && task.status !== selectedFilter) return false;
      if (selectedPriorities.length && !selectedPriorities.includes(task.priority)) return false;
      
      const searchTerm = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(searchTerm) ||
        task.description.toLowerCase().includes(searchTerm) ||
        task.type.toLowerCase().includes(searchTerm)
      );
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'dueDate':
          comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case 'priority':
          const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
          comparison = priorityOrder[b.priority as keyof typeof priorityOrder] - 
                      priorityOrder[a.priority as keyof typeof priorityOrder];
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Pagination
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'Overdue';
    } else if (diffDays === 0) {
      return 'Due Today';
    } else if (diffDays === 1) {
      return 'Due Tomorrow';
    } else {
      return `Due in ${diffDays} days`;
    }
  };

  if (isCreating) {
    return <CreateTaskPage onBack={() => setIsCreating(false)} />;
  }

  if (selectedTask) {
    return <TaskDetailPage />;
  }

  return (
    <AdminDashboardLayout>
      <main className="lg:p-8">
        {/* Header */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">Tasks</h1>
            <p className="text-gray-600">
              Manage and track company tasks
            </p>
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
                <ListTodo className="w-6 h-6 text-[#1649FF]" />
              </div>
              <span className="text-xs px-2 py-1 bg-[#E8FFF3] text-[#9EE248] rounded-full">
                Total
              </span>
            </div>
            <h3 className="text-2xl font-semibold mb-1">{tasks.length}</h3>
            <p className="text-sm text-gray-500">All Tasks</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-[#1649FF]" />
              </div>
              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                In Progress
              </span>
            </div>
            <h3 className="text-2xl font-semibold mb-1">
              {tasks.filter(t => t.status === 'IN_PROGRESS').length}
            </h3>
            <p className="text-sm text-gray-500">Active Tasks</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-[#1649FF]" />
              </div>
              <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">
                High Priority
              </span>
            </div>
            <h3 className="text-2xl font-semibold mb-1">
              {tasks.filter(t => t.priority === 'HIGH').length}
            </h3>
            <p className="text-sm text-gray-500">Urgent Tasks</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-[#1649FF]" />
              </div>
              <span className="text-xs px-2 py-1 bg-[#E8FFF3] text-[#9EE248] rounded-full">
                Completed
              </span>
            </div>
            <h3 className="text-2xl font-semibold mb-1">
              {tasks.filter(t => t.status === 'COMPLETED').length}
            </h3>
            <p className="text-sm text-gray-500">Finished Tasks</p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search and Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              {/* Search */}
              <div className="relative flex-grow max-w-md">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                    focus:ring-2 focus:ring-[#1649FF]"
                />
              </div>

              {/* Status Filter */}
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                  focus:ring-2 focus:ring-[#1649FF]"
              >
                <option value="ALL">All Status</option>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>

              {/* Priority Filter */}
              <div className="relative">
                <button
                  onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg 
                    hover:bg-gray-50"
                >
                  <Filter size={16} />
                  <span>Priority</span>
                  <ChevronDown size={16} className={`transition-transform duration-200 
                    ${isFilterMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isFilterMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg 
                    border border-gray-200 z-50">
                    {['HIGH', 'MEDIUM', 'LOW'].map(priority => (
                      <label
                        key={priority}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPriorities.includes(priority)}
                          onChange={() => {
                            setSelectedPriorities(prev =>
                              prev.includes(priority)
                                ? prev.filter(p => p !== priority)
                                : [...prev, priority]
                            );
                          }}
                          className="rounded border-gray-300 text-[#1649FF] focus:ring-[#1649FF]"
                        />
                        <span>{priority}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                  focus:ring-2 focus:ring-[#1649FF]"
              >
                <option value="dueDate">Sort by: Due Date</option>
                <option value="priority">Sort by: Priority</option>
                <option value="title">Sort by: Title</option>
                <option value="status">Sort by: Status</option>
              </select>
            </div>

            {/* Bulk Actions */}
            {selectedItems.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBulkAction('complete')}
                  className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
                >
                  Mark Complete
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                >
                  Delete Selected
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tasks Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1649FF]"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="w-8 p-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.length === paginatedTasks.length}
                          onChange={(e) => {
                            setSelectedItems(
                              e.target.checked
                                ? paginatedTasks.map(t => t.id)
                                : []
                            );
                          }}
                          className="rounded border-gray-300 text-[#1649FF] focus:ring-[#1649FF]"
                        />
                      </th>
                      <th className="text-left p-4">
                        <button
                          onClick={() => handleSort('title')}
                          className="flex items-center gap-2 text-sm font-medium text-gray-500 
                            hover:text-gray-700"
                        >
                          Task
                          <ArrowUpDown size={14} />
                        </button>
                      </th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Priority</th>
                      <th className="text-left p-4">Due Date</th>
                      <th className="text-right p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedTasks.map((task) => (
                      <tr key={task.id} className="hover:bg-gray-50">
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(task.id)}
                            onChange={(e) => {
                              setSelectedItems(prev =>
                                e.target.checked
                                  ? [...prev, task.id]
                                  : prev.filter(id => id !== task.id)
                              );
                            }}
                            className="rounded border-gray-300 text-[#1649FF] focus:ring-[#1649FF]"
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Building2 className="w-8 h-8 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900">{task.title}</p>
                              <p className="text-sm text-gray-500 line-clamp-2">
                                {task.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full 
                            text-xs font-medium border ${getStatusColor(task.status)}`}>
                            <Clock size={14} />
                            {task.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full 
                            text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                            <AlertCircle size={14} />
                            {task.priority}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar size={14} className="text-gray-400" />
                            <span className={task.status !== 'COMPLETED' ? 'font-medium' : ''}>
                              {formatDate(task.dueDate)}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => navigate(`/admin/tasks/details`, { state: { taskId: task.id } })}
                              className="p-2 text-gray-400 hover:text-[#1649FF] hover:bg-[#1649FF]/10 
                                rounded-lg transition-colors group relative"
                              title="View Details"
                            >
                              <ArrowUpRight className="w-5 h-5" />
                              <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 
                                bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 
                                group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                View Details
                              </span>
                            </button>
                            <button
                              onClick={() => {
                                // Handle delete
                              }}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 
                                rounded-lg transition-colors group relative"
                              title="Delete Task"
                            >
                              <Trash className="w-5 h-5" />
                              <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 
                                bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 
                                group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                Delete Task
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t 
                border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Show</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-2 py-1 border border-gray-200 rounded-lg text-sm"
                  >
                    {[10, 25, 50, 100].map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                  <span className="text-sm text-gray-500">entries</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        currentPage === page
                          ? 'bg-[#1649FF] text-white'
                          : 'border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>

                <div className="text-sm text-gray-500">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredTasks.length)} of{' '}
                  {filteredTasks.length} entries
                </div>
              </div>
            </>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-medium text-blue-900">Managing Tasks</h3>
              <p className="text-sm text-blue-700 mt-1">
                Use bulk actions to efficiently manage multiple tasks at once. You can mark tasks as 
                complete or delete them in bulk.
              </p>
            </div>
          </div>
        </div>
      </main>
    </AdminDashboardLayout>
  );
}