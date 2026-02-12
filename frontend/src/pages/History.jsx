import DashboardLayout from '../components/DashboardLayout';
import { Calendar, MessageSquare, FileText, Clock, Inbox } from 'lucide-react';

export default function History() {
  return (
    <DashboardLayout>
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-background-dark">
        <div className="w-full px-6 py-8 md:px-10 lg:px-16 lg:py-10 max-w-[1200px] mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              History
            </h1>
            <p className="text-gray-600 dark:text-muted">
              View your past consultations and health records
            </p>
          </div>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-card-dark rounded-xl border border-gray-300 dark:border-sidebar-border">
            <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-sidebar-hover flex items-center justify-center mb-4">
              <Inbox className="w-10 h-10 text-gray-400 dark:text-muted" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No History Yet
            </h3>
            <p className="text-gray-600 dark:text-muted text-center max-w-md">
              Your consultation history and health records will appear here once you start using the app.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
