import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, PlusCircle, ArrowRight, Eye } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

// Mock consultation data
const CONSULTATIONS = [
  {
    id: 1,
    title: 'Headache & Nausea',
    date: 'Oct 24, 2023 • 10:30 AM',
    summary: 'AI suggests monitoring hydration levels. Initial assessment points towards a possible migraine trigger or mild...',
    status: 'in-progress',
  },
  {
    id: 2,
    title: 'Annual Checkup Review',
    date: 'Sept 10, 2023 • 2:15 PM',
    summary: 'Blood pressure trends analyzed from uploaded documents. Cholesterol levels are within normal range. Exercise plan...',
    status: 'completed',
  },
  {
    id: 3,
    title: 'Skin Rash Inquiry',
    date: 'Aug 05, 2023 • 9:00 AM',
    summary: 'Visual analysis of forearm rash suggests contact dermatitis. Dermatology referral recommended if symptoms persist for...',
    status: 'completed',
  },
  {
    id: 4,
    title: 'Dietary Consultation',
    date: 'July 12, 2023 • 4:45 PM',
    summary: 'Meal plan generated focusing on low-sodium intake. Supplement recommendations provided for Vitamin D and...',
    status: 'completed',
  },
];

function StatusBadge({ status }) {
  if (status === 'in-progress') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold border border-primary/20">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        In-Progress
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
      Completed
    </span>
  );
}

function ConsultationCard({ consultation }) {
  const isInProgress = consultation.status === 'in-progress';

  return (
    <div className="flex flex-col p-5 rounded-xl bg-white dark:bg-card-dark border border-neutral-200 dark:border-sidebar-border hover:border-primary/50 transition-colors group cursor-pointer shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-col gap-1">
          <h3 className="text-neutral-900 dark:text-white text-lg font-bold leading-snug group-hover:text-primary transition-colors">
            {consultation.title}
          </h3>
          <div className="flex items-center gap-2 text-neutral-500 dark:text-muted text-xs font-medium">
            <Calendar className="w-4 h-4" />
            <span>{consultation.date}</span>
          </div>
        </div>
        <StatusBadge status={consultation.status} />
      </div>

      <p className="text-neutral-500 dark:text-muted text-sm leading-relaxed mb-6 line-clamp-2">
        {consultation.summary}
      </p>

      <div className="mt-auto flex justify-end">
        {isInProgress ? (
          <button className="flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-sidebar-hover hover:bg-neutral-800 dark:hover:bg-card-hover text-white text-sm font-bold rounded-lg transition-colors border border-neutral-700 dark:border-sidebar-border">
            <span>Resume Session</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button className="flex items-center gap-2 px-4 py-2 text-neutral-900 dark:text-white hover:text-primary dark:hover:text-primary text-sm font-bold transition-colors">
            <span>View Summary</span>
            <Eye className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function ChatDashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const filteredConsultations = CONSULTATIONS.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="w-full px-6 py-8 md:px-10 lg:px-16 lg:py-10 max-w-[1200px] mx-auto flex flex-col gap-6">
        {/* Greeting */}
        <div className="flex flex-wrap justify-between items-end gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">
              {getGreeting()}, Sarah
            </h1>
            <p className="text-neutral-500 dark:text-muted text-base font-normal">
              Manage your health conversations and insights.
            </p>
          </div>
        </div>

        {/* Hero CTA Section */}
        <div className="w-full rounded-2xl overflow-hidden relative group">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA-274e2qMptEPc-7dsbpaEaP33JMXXxoh17-fSsOmNV-KOFf3TbhRgLrGOUwlXZb03CMcYB0i9HXkbzr9hW4mtXQ_l08Mzan0qQAlxdveengrCbHqj7LKW-3RPI803_r9ykqOsC_AZfv__CA1ns-cwf4_rpbAn24e1ivRz80vmeNdU9vQxDsV5xK0-ol5SAgXgAaWVzdk7lOaBl4mMUA5DOHQtcUKFW4Ibnyu1-s0Z9jXKpVAJWFsiX2aHVnRH-KFzqWZqE6lotjg')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-background-dark/90 to-background-dark/40 z-0" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-6 py-10 md:px-10 md:py-12">
            <div className="flex flex-col gap-3 max-w-xl">
              <h2 className="text-white text-2xl md:text-3xl font-bold leading-tight tracking-tight">
                How are you feeling today?
              </h2>
              <p className="text-blue-100 text-base font-medium leading-relaxed opacity-90">
                Start a new session to get AI-powered health insights immediately based on your current symptoms.
              </p>
            </div>
            <div className="shrink-0">
              <Link
                to="/chat"
                className="flex items-center gap-2 h-12 px-6 bg-primary hover:bg-blue-600 text-white text-base font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all transform hover:scale-105 active:scale-95"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Start New Consultation</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Search & Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-4">
          <h2 className="text-[22px] font-bold leading-tight tracking-tight">Recent Consultations</h2>
          <div className="w-full md:w-auto min-w-[320px]">
            <label className="flex w-full items-center h-11 rounded-lg bg-white dark:bg-card-dark border border-neutral-200 dark:border-sidebar-border overflow-hidden focus-within:ring-2 ring-primary/50 transition-shadow">
              <div className="pl-3 pr-2 text-muted flex items-center justify-center">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-full bg-transparent border-none text-sm font-medium placeholder:text-muted focus:ring-0 focus:outline-none p-0"
                placeholder="Search by symptom or date..."
              />
            </label>
          </div>
        </div>

        {/* Consultations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-10">
          {filteredConsultations.map((consultation) => (
            <ConsultationCard key={consultation.id} consultation={consultation} />
          ))}
        </div>

        {/* Empty State */}
        {filteredConsultations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted text-lg">No consultations found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
