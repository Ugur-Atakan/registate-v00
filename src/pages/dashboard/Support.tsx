import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  Search,
  Filter,
  Plus,
  MessageSquare,
  Clock,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  User
} from 'lucide-react';
import { getCompanyTickets } from '../../http/requests/companyRequests';

interface Ticket {
  id: string;
  ticketNo: number;
  userId: string;
  subject: string;
  category: 'ACCOUNT' | 'TECHNICAL' | 'BILLING' | 'GENERAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  isActivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function Support() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  useEffect(() => {


  const fetchTickets=async()=>{
    try {
      setLoading(false);
      const tickets= await getCompanyTickets();
      console.log('tickets',tickets);
      setTickets(tickets);
      setLoading(false);
    } catch (error:any) {
      setLoading(false);
      console.error('Error fetching company tickets:', error);
    }
  } 
    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || ticket.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || ticket.priority === selectedPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

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

  const getCategoryIcon = (category: Ticket['category']) => {
    switch (category) {
      case 'ACCOUNT':
        return <User className="w-4 h-4" />;
      case 'TECHNICAL':
        return <AlertCircle className="w-4 h-4" />;
      case 'BILLING':
        return <Clock className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    return `${diffMinutes}m ago`;
  };

  return (
    <DashboardLayout>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Support</h1>
            <p className="text-gray-600">
              View and manage your support tickets
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard/support/new')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[--primary] text-white 
              rounded-lg hover:bg-[--primary]/90 transition-colors"
          >
            <Plus size={20} />
            New Ticket
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                  focus:ring-2 focus:ring-[--primary] focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-2.5 text-gray-400" size={20} />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                  focus:ring-2 focus:ring-[--primary] focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="relative">
              <AlertCircle className="absolute left-3 top-2.5 text-gray-400" size={20} />
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                  focus:ring-2 focus:ring-[--primary] focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Priority</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-[--primary] border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Loading tickets...</p>
            </div>
          ) : filteredTickets.length > 0 ? (
            filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => navigate(`/dashboard/ticket/details`, { state: { ticketId: ticket.id } })}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  {/* Ticket Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-1.5 rounded-lg ${getStatusColor(ticket.status)}`}>
                        {getCategoryIcon(ticket.category)}
                      </div>
                      <h3 className="font-medium text-gray-900 truncate">
                        #{ticket.ticketNo} - {ticket.subject}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs 
                        font-medium border ${getStatusColor(ticket.status)}`}>
                        {ticket.status === 'RESOLVED' ? (
                          <CheckCircle2 size={14} />
                        ) : (
                          <Clock size={14} />
                        )}
                        {ticket.status}
                      </span>

                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs 
                        font-medium border ${getPriorityColor(ticket.priority)}`}>
                        <AlertCircle size={14} />
                        {ticket.priority} Priority
                      </span>

                      <span className="text-gray-500">
                        {ticket.category}
                      </span>
                    </div>
                  </div>

                  {/* Time and Action */}
                  <div className="flex items-center gap-3 self-center">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{getTimeAgo(ticket.updatedAt)}</p>
                      <p className="text-xs text-gray-400">{formatDate(ticket.createdAt)}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
              <p className="text-gray-500">
                {searchTerm || selectedStatus !== 'all' || selectedPriority !== 'all'
                  ? "Try adjusting your filters"
                  : "You haven't created any support tickets yet"}
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}