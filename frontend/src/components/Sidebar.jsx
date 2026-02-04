import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Heart, History, Settings, Cross } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/health-profile', icon: Heart, label: 'My Health Profile' },
  { path: '/history', icon: History, label: 'History' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

const USER = {
  name: 'Sarah Doe',
  plan: 'Premium Plan',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjpkcCciqWg2vKAAJVsaiFfnQXXBWrgAB781s0OmCJHo7qfYmPQ1KoO94nQXtHTNLOMJs3TkBpVLbUhOpb5jLKoit4j3_zTjgrxCJ0L6o3hauCiYFt7MyJuyhAbWb4yyKkikqQRNe9o9VI0zziNBRyGsfHUUINcYZCjdVrIEVgQnpTc7cc3yVrfRfcqKo7Qpk0qdvqNOsHE63XwUU3YxkAkNLxJnaVIgAMJX2BmyqfsrDnAaDw8k9HkPtX5fUbv0w6utQ5Qwa43DM',
};

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-[280px] h-full bg-sidebar border-r border-sidebar-border p-4 justify-between shrink-0 z-20">
      <div className="flex flex-col gap-4">
        {/* Branding */}
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-white">
            <Cross className="w-5 h-5" />
          </div>
          <h1 className="text-white text-xl font-bold leading-normal tracking-tight">MediAI</h1>
        </div>

        {/* Nav Menu */}
        <nav className="flex flex-col gap-2 mt-4">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-muted hover:bg-sidebar-hover hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <p className={`text-sm font-medium leading-normal`}>{item.label}</p>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User Profile */}
      <div className="flex flex-col gap-1 border-t border-sidebar-border pt-4">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-hover cursor-pointer transition-colors">
          <div
            className="w-10 h-10 rounded-full border border-sidebar-border bg-cover bg-center"
            style={{ backgroundImage: `url('${USER.avatar}')` }}
          />
          <div className="flex flex-col">
            <p className="text-white text-sm font-bold leading-normal">{USER.name}</p>
            <p className="text-muted text-xs font-normal">{USER.plan}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
