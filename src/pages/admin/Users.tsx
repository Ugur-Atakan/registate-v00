import { useEffect, useState } from "react";
import AdminDashboardLayout from "../../components/layout/AdminDashboardLayout";
import { Plus, Bell, X, Menu, Search, Eye, Trash } from "lucide-react";
import UserDetailPage from "./UserDetails";
import { User } from "../../types/User";
import { getAllUsers } from "../../http/requests/admin/user";

export default function AdminUsers() {
    const [users, setUsers] = useState<User[]>([]);
   
    const fetchUsers = async () => {
        const users = await getAllUsers();
        setUsers(users);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const [selectedFilter, setSelectedFilter] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
    const filteredUsers = users.filter(user => {
      if (selectedFilter === 'ACTIVE' && !user.emailConfirmed) return false;
      if (selectedFilter === 'INACTIVE' && user.emailConfirmed) return false;
      
      const searchTerm = searchQuery.toLowerCase();
      return (
        user.firstName.toLowerCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      );
    }).sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case 'email':
          return a.email.localeCompare(b.email);
        case 'recent':
          return -1; // In real implementation, compare createdAt dates
        default:
          return 0;
      }
    });
  
    if (selectedUserId) {
      return <UserDetailPage onBack={() => setSelectedUserId(null)} />;
    }
    return (
        <AdminDashboardLayout>
            <main className="lg:p-8">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl lg:text-2xl font-semibold text-[#333333]">Users</h1>
          <p className="text-sm text-gray-500">Manage registered users</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-[#1649FF] text-white rounded-lg flex items-center hover:bg-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            Add User
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

      {/* Filters Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        {/* Mobile Filter Toggle */}
        <div className="flex lg:hidden justify-between items-center w-full">
          <button
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="px-4 py-2 bg-white text-gray-600 rounded-lg border border-gray-200"
          >
            {isMobileFiltersOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            <span className="ml-2">Filters</span>
          </button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1649FF]"
          >
            <option value="name">Sort by: Name</option>
            <option value="email">Sort by: Email</option>
            <option value="recent">Sort by: Recent</option>
          </select>
        </div>

        {/* Filter Buttons */}
        <div className={`flex flex-wrap gap-2 ${isMobileFiltersOpen ? 'block' : 'hidden'} lg:flex`}>
          {['ALL', 'ACTIVE', 'INACTIVE'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedFilter === filter
                  ? 'bg-[#1649FF] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {filter === 'ALL' ? 'All Users' : filter.charAt(0) + filter.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Search and Sort - Desktop */}
        <div className="hidden lg:flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
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
            <option value="name">Sort by: Name</option>
            <option value="email">Sort by: Email</option>
            <option value="recent">Sort by: Recent</option>
          </select>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1649FF]"
          />
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Table Header - Desktop */}
        <div className="hidden lg:grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50 text-sm font-medium">
          <div className="col-span-3">User</div>
          <div className="col-span-3">Role</div>
          <div className="col-span-4">Email</div>
          <div className="col-span-2">Actions</div>
        </div>

        {/* Users */}
        <div className="divide-y divide-gray-200">
          {filteredUsers.map((user) => (
            <div key={user.id} className="p-4">
              {/* Desktop View */}
              <div className="hidden lg:grid grid-cols-12 gap-4 items-center">
                <div className="col-span-3 flex items-center">
                  <img
                    src={user.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span className="text-sm font-medium">{user.firstName} {user.lastName}</span>
                </div>
                <div className="col-span-3 text-sm">
                  {user.roles.map(role => (
                    <span key={role} className="px-2 py-1 text-xs bg-[#EEF2FF] text-[#1649FF] rounded-full">
                      {role}
                    </span>
                  ))}
                </div>
                <div className="col-span-4 text-sm">{user.email}</div>
                <div className="col-span-2 flex space-x-2">
                  <button 
                    onClick={() => setSelectedUserId(user.id)}
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
                    <img
                      src={user.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setSelectedUserId(user.id)}
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
                  {user.roles.map(role => (
                    <span key={role} className="px-2 py-1 text-xs bg-[#EEF2FF] text-[#1649FF] rounded-full">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-6 gap-4">
        <p className="text-sm text-gray-600 text-center lg:text-left">
          Showing {filteredUsers.length} of {users.length} users
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
