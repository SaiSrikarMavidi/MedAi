import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Heart, History, Settings, User as UserIcon, MessageSquare, Bell, Utensils, Stethoscope, ShoppingCart, Calendar, Sun, Moon, Cross } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const NAV_ITEMS = [
  { path: '/dashboard', section: 'consultations', icon: MessageSquare, label: 'Consultations', isDashboardSection: true },
  { path: '/dashboard', section: 'daily-plan', icon: Calendar, label: 'Daily Plan', isDashboardSection: true },
  { path: '/dashboard', section: 'carepath', icon: Stethoscope, label: 'Care Path', isDashboardSection: true },
  { path: '/dashboard', section: 'reminders', icon: Bell, label: 'Reminders', isDashboardSection: true },
  { path: '/dashboard', section: 'pharmacy', icon: ShoppingCart, label: 'Pharmacy', isDashboardSection: true },
  { path: '/dashboard', section: 'food', icon: Utensils, label: 'Food Advisor', isDashboardSection: true },
  { path: '/dashboard', section: 'health-profile', icon: Heart, label: 'My Health Profile', isDashboardSection: true },
  { path: '/dashboard', section: 'history', icon: History, label: 'History', isDashboardSection: true },
  { path: '/dashboard', section: 'settings', icon: Settings, label: 'Settings', isDashboardSection: true },
];

export default function Sidebar() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentSection = new URLSearchParams(location.search).get('section') || 'consultations';
  
  const handleNavClick = (item) => {
    if (item.isDashboardSection) {
      navigate(`/dashboard?section=${item.section}`);
    }
  };
  
  return (
    <aside className="hidden lg:flex flex-col w-[280px] h-full bg-white dark:bg-sidebar border-r border-gray-300 dark:border-sidebar-border p-4 justify-between shrink-0 z-20">
      <div className="flex flex-col gap-4">
        {/* Branding */}
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 text-white">
            <Cross className="w-5 h-5" />
          </div>
          <h1 className="text-gray-900 dark:text-white text-xl font-bold leading-normal tracking-tight">MediAI</h1>
        </div>

        {/* Nav Menu */}
        <nav className="flex flex-col gap-2 mt-4">
          {NAV_ITEMS.map((item) => {
            if (item.isDashboardSection) {
              const isActive = location.pathname === '/dashboard' && currentSection === item.section;
              return (
                <button
                  key={item.section}
                  onClick={() => handleNavClick(item)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-left ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-600 dark:text-muted hover:bg-gray-100 dark:hover:bg-sidebar-hover hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <p className={`text-sm font-medium leading-normal`}>{item.label}</p>
                </button>
              );
            }
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-600 dark:text-muted hover:bg-gray-100 dark:hover:bg-sidebar-hover hover:text-gray-900 dark:hover:text-white'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <p className={`text-sm font-medium leading-normal`}>{item.label}</p>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Profile */}
      <div className="flex flex-col gap-3 border-t border-gray-300 dark:border-sidebar-border pt-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-sidebar-hover text-gray-600 dark:text-muted hover:text-gray-900 dark:hover:text-white transition-colors group"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-5 h-5" />
              <span className="text-sm font-medium">Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-5 h-5" />
              <span className="text-sm font-medium">Dark Mode</span>
            </>
          )}
        </button>
        
        {/* User Info */}
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-sidebar-hover cursor-pointer transition-colors">
          {user?.avatar ? (
            <div
              className="w-10 h-10 rounded-full border border-sidebar-border bg-cover bg-center"
              style={{ backgroundImage: `url('${user.avatar}')` }}
            />
          ) : (
            <div className="w-10 h-10 rounded-full border border-gray-300 dark:border-sidebar-border bg-primary/20 flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-primary" />
            </div>
          )}
          <div className="flex flex-col">
            <p className="text-gray-900 dark:text-white text-sm font-bold leading-normal">{user?.name || 'User'}</p>
            <p className="text-gray-500 dark:text-muted text-xs font-normal">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
