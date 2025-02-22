import AdminDashboardLayout from "../../components/layout/AdminDashboardLayout";
import { Lock, Mail, LayoutDashboard, Users, Headphones, ListTodo, Tag, Briefcase, Settings, LogOut, Bell, Menu, X } from 'lucide-react';

export default function AdminDashboard(){
    return (
        <AdminDashboardLayout>
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl lg:text-2xl font-semibold text-[#333333]">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Overview & Statistics</p>
        </div>
        <div className="flex items-center space-x-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-[#1649FF]" />
            </div>
            <span className="text-xs px-2 py-1 bg-[#E8FFF3] text-[#9EE248] rounded-full">+12.5%</span>
          </div>
          <h3 className="text-2xl font-semibold mb-1">2,543</h3>
          <p className="text-sm text-gray-500">Total Users</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
              <Headphones className="w-6 h-6 text-[#1649FF]" />
            </div>
            <span className="text-xs px-2 py-1 bg-[#E8FFF3] text-[#9EE248] rounded-full">+5.2%</span>
          </div>
          <h3 className="text-2xl font-semibold mb-1">182</h3>
          <p className="text-sm text-gray-500">Active Support Tickets</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-[#1649FF]" />
            </div>
            <span className="text-xs px-2 py-1 bg-[#E8FFF3] text-[#9EE248] rounded-full">+8.7%</span>
          </div>
          <h3 className="text-2xl font-semibold mb-1">1,234</h3>
          <p className="text-sm text-gray-500">Active Companies</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
              <ListTodo className="w-6 h-6 text-[#1649FF]" />
            </div>
            <span className="text-xs px-2 py-1 bg-[#E8FFF3] text-[#9EE248] rounded-full">+15.3%</span>
          </div>
          <h3 className="text-2xl font-semibold mb-1">456</h3>
          <p className="text-sm text-gray-500">Pending Tasks</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <section className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Users</h2>
            <button className="text-sm text-gray-600 hover:text-gray-900">View all</button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=user1"
                className="w-10 h-10 rounded-full mr-4"
                alt="User Avatar"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">John Smith</p>
                <p className="text-xs text-gray-500">Registered 2 days ago</p>
              </div>
              <span className="px-2 py-1 text-xs bg-[#E8FFF3] text-[#9EE248] rounded-full whitespace-nowrap ml-2">Active</span>
            </div>
            <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=user2"
                className="w-10 h-10 rounded-full mr-4"
                alt="User Avatar"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Sarah Johnson</p>
                <p className="text-xs text-gray-500">Registered 3 days ago</p>
              </div>
              <span className="px-2 py-1 text-xs bg-[#E8FFF3] text-[#9EE248] rounded-full whitespace-nowrap ml-2">Active</span>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Support Tickets</h2>
            <button className="text-sm text-gray-600 hover:text-gray-900">View all</button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-[#EEF2FF] rounded-lg flex items-center justify-center mr-4">
                <Headphones className="w-5 h-5 text-[#1649FF]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Payment Issue</p>
                <p className="text-xs text-gray-500">Opened 1 hour ago</p>
              </div>
              <span className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full whitespace-nowrap ml-2">High</span>
            </div>
            <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-[#EEF2FF] rounded-lg flex items-center justify-center mr-4">
                <Headphones className="w-5 h-5 text-[#1649FF]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Account Access</p>
                <p className="text-xs text-gray-500">Opened 3 hours ago</p>
              </div>
              <span className="px-2 py-1 text-xs bg-[#EEF2FF] text-[#1649FF] rounded-full whitespace-nowrap ml-2">Medium</span>
            </div>
          </div>
        </section>
      </div>
    
        </AdminDashboardLayout>
   )
}