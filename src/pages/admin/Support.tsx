import { useEffect, useState } from "react";
import AdminDashboardLayout from "../../components/layout/AdminDashboardLayout";
import instance from "../../http/instance";
import AdminTicketDetailsPage from "./TicketDetails";
import { Ticket } from "../../http/requests/admin/support";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell, Eye, MessageSquare } from 'lucide-react';
import { useAppSelector } from "../../store/hooks";
import AdminAvatar from "../../components/AdminAvatar";

const getStatusColor = (status: string) => {
  switch (status) {
    case 'OPEN':
      return 'bg-[#EEF2FF] text-[#1649FF]';
    case 'IN_PROGRESS':
      return 'bg-[#E8FFF3] text-[#9EE248]';
    case 'RESOLVED':
      return 'bg-gray-100 text-gray-600';
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

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}d ago`;
  }
  return `${hours}h ago`;
};


export default function AdminSupport() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const location = useLocation();

  const companyId = location.state?.companyId;
  // if(companyId){ 
  //   return <div>Company Gönderildi</div>
  // }
  const navigate=useNavigate();
  useEffect(() => {
    const fetchTickets = async () => {
      const res = await instance.get("/admin/support/tickets");
      setTickets(res.data);
    };
    fetchTickets();
  }, []);

  const filteredTickets = tickets
    .filter(ticket => 
      selectedStatus === 'ALL' || ticket.status === selectedStatus
    )
    .filter(ticket =>
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'latest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'priority') {
        const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
      }
      return 0;
    });



  if (selectedTicket) {
    return <AdminTicketDetailsPage/>;
  }

  return (
    <AdminDashboardLayout>
      <main className="p-4 lg:p-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl lg:text-2xl font-semibold text-[#333333]">Support Tickets</h1>
          <p className="text-sm text-gray-500">Manage customer support tickets</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5" />
          </button>
          <AdminAvatar/>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        {/* Mobile Filter Toggle */}
        <div className="flex lg:hidden justify-between items-center w-full">
          <button
            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
            className="px-4 py-2 bg-white text-gray-600 rounded-lg border border-gray-200"
          >
            Filters
          </button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1649FF] focus:border-transparent"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="priority">Priority</option>
          </select>
        </div>

        {/* Status Filters */}
        <div className={`flex flex-wrap gap-2 ${isFilterMenuOpen ? 'block' : 'hidden'} lg:flex`}>
          {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedStatus === status
                  ? 'bg-[#1649FF] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {status === 'ALL' ? 'All Tickets' : status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Search and Sort - Desktop */}
        <div className="hidden lg:flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-[#1649FF] focus:border-transparent"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1649FF] focus:border-transparent"
          >
            <option value="latest">Sort by: Latest</option>
            <option value="oldest">Sort by: Oldest</option>
            <option value="priority">Sort by: Priority</option>
          </select>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden relative">
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1649FF] focus:border-transparent"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Table Header - Desktop */}
        <div className="hidden lg:grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50 text-sm font-medium">
          <div className="col-span-1">ID</div>
          <div className="col-span-3">Customer</div>
          <div className="col-span-2">Subject</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Priority</div>
          <div className="col-span-1">Created</div>
          <div className="col-span-1">Actions</div>
        </div>

        {/* Tickets */}
        <div className="divide-y divide-gray-200">
          {filteredTickets.map((ticket) => (
            <div key={ticket.id} className="p-4">
              {/* Desktop View */}
              <div className="hidden lg:grid grid-cols-12 gap-4 items-center">
                <div className="col-span-1 text-sm">#{ticket.ticketNo}</div>
                <div className="col-span-3 flex items-center">
                  <span className="text-sm">{ticket.company[0]?.companyName}/{ticket.user.firstName}</span>
                </div>
                <div className="col-span-2 text-sm">{ticket.subject}</div>
                <div className="col-span-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(ticket.status)}`}>
                    {ticket.status.charAt(0) + ticket.status.slice(1).toLowerCase().replace('_', ' ')}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority.charAt(0) + ticket.priority.slice(1).toLowerCase()}
                  </span>
                </div>
                <div className="col-span-1 text-sm">{formatDate(ticket.createdAt)}</div>
                <div className="col-span-1 flex space-x-2">
                  <button 
                     onClick={() => navigate(`/admin/support/details`, { state: { ticketId: ticket.id } })}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Mobile View */}
              <div className="lg:hidden space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="font-medium">User {ticket.user.firstName}</p>
                      <p className="text-sm text-gray-500">#{ticket.ticketNo}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{formatDate(ticket.createdAt)}</span>
                </div>
                <div>
                  <h3 className="font-medium mb-1">{ticket.subject}</h3>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(ticket.status)}`}>
                      {ticket.status.charAt(0) + ticket.status.slice(1).toLowerCase().replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority.charAt(0) + ticket.priority.slice(1).toLowerCase()}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setSelectedTicket(ticket.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-6 gap-4">
        <p className="text-sm text-gray-600 text-center lg:text-left">
          Showing {filteredTickets.length} of {tickets.length} tickets
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
    </main>
    </AdminDashboardLayout>
  );
}
