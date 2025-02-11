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
  ListTodo
} from 'lucide-react';
import CompanyChanger from '../CompanyChanger';

interface Props {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

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
      href: '/dashboard/documents',
      icon: Folder,
      current: location.pathname.startsWith('/dashboard/documents'),
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
      current: location.pathname === '/dashboard/tasks'
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

  // Route değiştiğinde mobil menüyü kapat
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <CompanyChanger />
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <img
                src="https://registate.betterwp.site/wp-content/uploads/2025/01/registate-logo.webp"
                alt="Registate"
                className="h-8"
              />
            </div>
            <nav className="mt-8 flex-1 space-y-1 px-2">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    to={item.href}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                      item.current
                        ? 'bg-[--primary] text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {item.icon && (
                      <item.icon
                        className={`mr-3 h-5 w-5 flex-shrink-0 ${
                          item.current
                            ? 'text-white'
                            : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                      />
                    )}
                    {item.name}
                  </Link>
                  {item.children && item.children.length > 0 && (
                    <div className="pl-6 space-y-1">
                      {item.children.map((child) => (
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
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden border-b border-gray-200 bg-white">
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-gray-200 bg-white py-2">
            {navigation.map((item) => (
              <div key={item.name}>
                <Link
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium ${
                    item.current
                      ? 'bg-[--primary]/10 text-[--primary]'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.icon && (
                    <item.icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 ${
                        item.current ? 'text-[--primary]' : 'text-gray-400'
                      }`}
                    />
                  )}
                  {item.name}
                </Link>
                {item.children && item.children.length > 0 && (
                  <div className="pl-6">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        to={child.href}
                        className={`flex items-center px-4 py-2 text-sm ${
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
                              child.current ? 'text-[--primary]' : 'text-gray-400'
                            }`}
                          />
                        )}
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
        <div className="grid grid-cols-3">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center py-3 ${
                item.current
                  ? 'text-[--primary]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {item.icon && <item.icon className="h-6 w-6" />}
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="md:pl-64">
        <main className="py-6 px-4 sm:px-6 md:px-8 pb-20 md:pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}
