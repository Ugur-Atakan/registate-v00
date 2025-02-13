import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Package,
  Menu,
  X,
  Folder,
  PhoneCall,
  Settings,
  FileText,
  Hash,
  File,
  FileCheck,
  PlusCircle,
  ListTodo,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import CompanyChanger from '../CompanyChanger';

interface Props {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);
  const [incompleteTasks, setIncompleteTasks] = useState(0);
  const location = useLocation();

  // Fetch incomplete tasks count
  useEffect(() => {
    const fetchIncompleteTasks = async () => {
      try {
        // This is demo data - in production, you would fetch from your API
        const demoTasks = [
          {
            id: "077bb32b-9825-4610-8d7e-c62b0fa84a1e",
            status: "OPEN"
          },
          {
            id: "177bb32b-9825-4610-8d7e-c62b0fa84a1f",
            status: "IN_PROGRESS"
          },
          {
            id: "277bb32b-9825-4610-8d7e-c62b0fa84a2g",
            status: "COMPLETED"
          }
        ];

        const incompleteCount = demoTasks.filter(
          task => task.status === "OPEN" || task.status === "IN_PROGRESS"
        ).length;

        setIncompleteTasks(incompleteCount);
      } catch (error) {
        console.error('Error fetching incomplete tasks:', error);
      }
    };

    fetchIncompleteTasks();
  }, []);

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      current: location.pathname === '/dashboard'
    },
    {
      name: 'My Companies',
      href: '/dashboard/companies',
      icon: Building2,
      current: location.pathname === '/dashboard/companies'
    },
    {
      name: 'Documents',
      href: '#',
      icon: Folder,
      current: location.pathname.startsWith('/dashboard/documents'),
      isExpandable: true,
      isOpen: isDocumentsOpen,
      children: [
        {
          name: 'Company Documents',
          href: '/dashboard/documents/#company',
          current: location.pathname === '/dashboard/documents/#company',
          icon: FileText
        },
        {
          name: 'Ein Number',
          href: '/dashboard/documents/#ein',
          current: location.pathname === '/dashboard/documents/#ein',
          icon: Hash
        },
        {
          name: 'Annual Report Filing',
          href: '/dashboard/documents/#annual',
          current: location.pathname === '/dashboard/documents/#annual',
          icon: File
        },
        {
          name: 'BOI Report Filing',
          href: '/dashboard/documents/#boi',
          current: location.pathname === '/dashboard/documents/#boi',
          icon: FileCheck
        },
        {
          name: 'Add New Service',
          href: '/dashboard/documents/#add-new-service',
          current: location.pathname === '/dashboard/documents/#add-new-service',
          icon: PlusCircle,
          action: true
        }
      ]
    },
    {
      name: 'Services',
      href: '/dashboard/services',
      icon: Package,
      current: location.pathname === '/dashboard/services'
    },
    {
      name: 'Tasks',
      href: '/dashboard/tasks',
      icon: ListTodo,
      current: location.pathname === '/dashboard/tasks',
      badge: incompleteTasks > 0 ? incompleteTasks : undefined
    },
    {
      name: 'Support',
      href: '/dashboard/support',
      icon: PhoneCall,
      current: location.pathname === '/dashboard/support'
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
      current: location.pathname === '/dashboard/settings'
    }
  ];

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const renderNavigationItem = (item: any, isMobile = false) => {
    if (item.isExpandable) {
      return (
        <div key={item.name}>
          <button
            onClick={() => setIsDocumentsOpen(!isDocumentsOpen)}
            className={`w-full group flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors
              ${item.current
                ? isMobile ? 'bg-[--primary]/10 text-[--primary]' : 'bg-[--primary] text-white'
                : 'text-gray-700 hover:bg-gray-50'
              }`}
          >
            <div className="flex items-center">
              <item.icon
                className={`mr-3 h-5 w-5 flex-shrink-0 ${
                  item.current 
                    ? isMobile ? 'text-[--primary]' : 'text-white'
                    : 'text-gray-400 group-hover:text-gray-500'
                }`}
              />
              {item.name}
            </div>
            {item.isOpen ? (
              <ChevronDown className={`h-5 w-5 ${
                item.current ? isMobile ? 'text-[--primary]' : 'text-white' : 'text-gray-400'
              }`} />
            ) : (
              <ChevronRight className={`h-5 w-5 ${
                item.current ? isMobile ? 'text-[--primary]' : 'text-white' : 'text-gray-400'
              }`} />
            )}
          </button>
          <div className={`mt-1 pl-6 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
            isDocumentsOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            {item.children?.map((child: any) => (
              <Link
                key={child.name}
                to={child.href}
                className={`group flex items-center px-4 py-2 text-sm rounded-lg ${
                  child.current
                    ? child.action
                      ? 'text-neutral-500'
                      : 'text-[--primary] font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {child.icon && (
                  <child.icon
                    className={`mr-3 h-4 w-4 flex-shrink-0 ${
                      child.current
                        ? 'text-[--primary]'
                        : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                )}
                {child.name}
              </Link>
            ))}
          </div>
        </div>
      );
    }

    return (
      <Link
        key={item.name}
        to={item.href}
        className={`group flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg ${
          item.current
            ? isMobile ? 'bg-[--primary]/10 text-[--primary]' : 'bg-[--primary] text-white'
            : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center">
          <item.icon
            className={`mr-3 h-5 w-5 flex-shrink-0 ${
              item.current 
                ? isMobile ? 'text-[--primary]' : 'text-white'
                : 'text-gray-400 group-hover:text-gray-500'
            }`}
          />
          {item.name}
        </div>
        {item.badge && (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            item.current
              ? isMobile 
                ? 'bg-[--primary] text-white'
                : 'bg-white text-[--primary]'
              : 'bg-[--primary] text-white'
          }`}>
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex flex-1 flex-col overflow-y-auto">
            <div className="flex flex-shrink-0 items-center px-4 pt-5 pb-2">
              <img
                src="https://registate.betterwp.site/wp-content/uploads/2025/01/registate-logo.webp"
                alt="Registate"
                className="h-8"
              />
            </div>
            <CompanyChanger />
            <nav className="flex-1 space-y-1 px-2">
              {navigation.map(item => renderNavigationItem(item))}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-2">
          <img
            src="https://registate.betterwp.site/wp-content/uploads/2025/01/registate-logo.webp"
            alt="Registate"
            className="h-8"
          />
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-500"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Slide from left */}
      <div 
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'visible' : 'invisible'
        }`}
      >
        {/* Overlay */}
        <div 
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            isMobileMenuOpen ? 'opacity-50' : 'opacity-0'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Sliding Menu */}
        <div
          className={`absolute top-0 left-0 w-[280px] h-full bg-white transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="h-full overflow-y-auto">
            {/* Logo in Mobile Menu */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
              <img
                src="https://registate.betterwp.site/wp-content/uploads/2025/01/registate-logo.webp"
                alt="Registate"
                className="h-8"
              />
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <CompanyChanger />
            <nav className="px-2 py-4">
              {navigation.map(item => renderNavigationItem(item, true))}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-30">
        <div className="grid grid-cols-3">
          {navigation.slice(0, 3).map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center py-3 relative ${
                item.current
                  ? 'text-[--primary]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs mt-1">{item.name}</span>
              {item.badge && (
                <span className="absolute top-2 right-1/4 px-1.5 py-0.5 text-xs font-medium bg-[--primary] text-white rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="md:pl-64 pt-14 md:pt-0">
        <main className="py-6 px-4 sm:px-6 md:px-8 pb-20 md:pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}