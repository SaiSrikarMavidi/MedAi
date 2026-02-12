import { useState } from 'react';
import { Menu, X, Cross } from 'lucide-react';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-background-dark font-display text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600">
      {/* Desktop Sidebar */}
      <Sidebar />

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
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto relative pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
