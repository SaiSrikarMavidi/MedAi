import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Home, Stethoscope, Bell, Utensils, User, Menu, X, Cross } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { path: '/dashboard', icon: Home, label: 'Home' },
  { path: '/doctors', icon: Stethoscope, label: 'Consultations' },
  { path: '/reminders', icon: Bell, label: 'Reminders' },
  { path: '/food', icon: Utensils, label: 'Food Advisor' },
];

function ChatSidebar() {
  return (
    <aside className="w-[280px] flex-shrink-0 flex-col border-r border-sidebar-border bg-sidebar h-full hidden lg:flex">
      <div className="p-4 pb-2">
        {/* Branding */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white shadow-lg">
            <Cross className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-white text-lg font-bold leading-tight">MediAI</h1>
            <p className="text-muted text-xs font-medium uppercase tracking-wider">Healthcare Platform</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-sidebar-hover text-white'
                    : 'text-muted hover:bg-sidebar-hover hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User Profile */}
      <ChatUserProfile />
    </aside>
  );
}

function ChatUserProfile() {
  const { user } = useAuth();
  
  return (
    <div className="mt-auto p-4 border-t border-sidebar-border">
      <Link to="/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-hover transition-colors">
        <User className="w-5 h-5 text-muted" />
        <div className="flex flex-col">
          <p className="text-white text-sm font-medium">{user?.name || 'Guest User'}</p>
          <p className="text-muted text-xs">View Profile</p>
        </div>
      </Link>
    </div>
  );
}

export default function ChatLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-background-dark text-white font-display overflow-hidden h-screen w-full flex">
      {/* Desktop Sidebar */}
      <ChatSidebar />

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-sidebar border-b border-sidebar-border flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded bg-primary text-white">
            <Cross className="w-4 h-4" />
          </div>
          <span className="text-white text-lg font-bold tracking-tight">MediAI</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-white bg-sidebar-hover rounded-md"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
          <div className="w-[280px] h-full" onClick={(e) => e.stopPropagation()}>
            <ChatSidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-sidebar relative pt-16 lg:pt-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
