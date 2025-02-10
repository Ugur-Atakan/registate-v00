import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Package,
  Menu,
  X,
  User2,
  Ticket,
  ListTodo,
  Receipt
} from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

export default function AdminDashboardLayout({ children }: Props) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      current: location.pathname === '/admin'
    },
    {
      name: 'Company Management',
      href: '/admin/companies',
      icon: Building2,
      current: location.pathname === '/admin/companies'
    },
    {
      name: 'Product Management',
      href: '/admin/products',
      icon: Package,
      current: location.pathname === '/admin/products'
    },{
        name: 'User Management',
        href: '/admin/users',
        icon: User2,
        current: location.pathname === '/admin/users'
    },
    {
        name: 'Ticket Management',
        href: '/admin/support',
        icon: Ticket,
        current: location.pathname === '/admin/support'
    },{
        name: 'Task Management',
        href: '/admin/task',
        icon: ListTodo,
        current: location.pathname === '/admin/task'

    },{
        name: 'Formation Management',
        href: '/admin/formation',
        icon: Building2,
        current: location.pathname === '/admin/formation'
    },{
        name: 'Order Management',
        href: '/admin/orders',
        icon: Receipt,
        current: location.pathname === '/admin/orders'
    }

  ];

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
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
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                    item.current
                      ? 'bg-[--primary] text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      item.current ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </Link>
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
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium ${
                  item.current
                    ? 'bg-[--primary]/10 text-[--primary]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    item.current ? 'text-[--primary]' : 'text-gray-400'
                  }`}
                />
                {item.name}
              </Link>
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
              <item.icon className="h-6 w-6" />
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