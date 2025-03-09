import Avvvatars from "avvvatars-react";
import AdminAvatar from "../../components/AdminAvatar";
import AdminDashboardLayout from "../../components/layout/AdminDashboardLayout";
import { Users, Headphones, ListTodo,  Briefcase, Bell} from 'lucide-react';
import { useEffect, useState } from "react";
import instance from "../../http/instance";
import LoadingComponent from "../../components/Loading";
import { useNavigate } from "react-router-dom";

interface Stats{
  totalUsers:number;
  activeCompanies:number;
  orders:number;
  pendingTasks:number;
  activeTickets:number;
  latesTickets:Ticket[];
  recentUsers:User[];
}
interface Ticket{
  id:string;
  ticketNo:number;
  priority:string;
  subject:string;
  status:string;
  createdAt:string;
  updatedAt:string;
}
interface User{
  id:string;
  firstName:string;
  lastName:string;
  profileImage:string;
  email:string;
  createdAt:string;
}



export default function AdminDashboard(){

const [stats,setStats]=useState<Stats>();
const [loading,setLoading]=useState(false);
const navigate=useNavigate();
  const getSystemStats=async()=>{
    setLoading(true);
    try{
      const response=await instance.get('/admin/stats');
      console.log('System stats:',response.data);
      setStats(response.data);
    }catch(error){
      console.error('Error fetching system stats:',error);
    }
    setLoading(false);
  }
  useEffect(()=>{
    getSystemStats();
  },[]);

  
  
  if(loading || !stats){
    return (<AdminDashboardLayout>
      <LoadingComponent/>
    </AdminDashboardLayout>)
  }

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
          <AdminAvatar />
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
          <h3 className="text-2xl font-semibold mb-1">{stats.totalUsers}</h3>
          <p className="text-sm text-gray-500">Total Users</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
              <Headphones className="w-6 h-6 text-[#1649FF]" />
            </div>
            <span className="text-xs px-2 py-1 bg-[#E8FFF3] text-[#9EE248] rounded-full">+5.2%</span>
          </div>
          <h3 className="text-2xl font-semibold mb-1">{stats.activeTickets}</h3>
          <p className="text-sm text-gray-500">Active Support Tickets</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-[#1649FF]" />
            </div>
            <span className="text-xs px-2 py-1 bg-[#E8FFF3] text-[#9EE248] rounded-full">+8.7%</span>
          </div>
          <h3 className="text-2xl font-semibold mb-1">{stats.activeCompanies}</h3>
          <p className="text-sm text-gray-500">Active Companies</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
              <ListTodo className="w-6 h-6 text-[#1649FF]" />
            </div>
          </div>
          <h3 className="text-2xl font-semibold mb-1">{stats.pendingTasks}</h3>
          <p className="text-sm text-gray-500">Pending Tasks</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <section className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Users</h2>
            <button className="text-sm text-gray-600 hover:text-gray-900" onClick={()=>navigate('/admin/users')}>View all</button>
          </div>
          <div className="space-y-4">
            {stats?.recentUsers.map((user:User)=>(
            <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
            <Avvvatars value={'User'} size={40} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{`${user.firstName} ${user.lastName}`}</p>
                <p className="text-xs text-gray-500">{(user.createdAt)}</p>
              </div>
              <span className="px-2 py-1 text-xs bg-[#E8FFF3] text-[#9EE248] rounded-full whitespace-nowrap ml-2">Active</span>
            </div>
              ))}
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Support Tickets</h2>
            <button className="text-sm text-gray-600 hover:text-gray-900" onClick={()=>navigate('/admin/support')}>View all</button>
          </div>
          <div className="space-y-4">
            {stats?.latesTickets.map((ticket:Ticket)=>(
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
            ))}
            
          </div>
        </section>
      </div>
    
        </AdminDashboardLayout>
   )
}