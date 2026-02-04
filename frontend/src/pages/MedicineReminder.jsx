import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Pill,
  ChevronLeft,
  ChevronRight,
  Sun,
  Sunset,
  Moon,
  BedDouble,
  CheckCircle,
  Clock,
  ShoppingCart,
  MessageCircle,
  Package,
} from 'lucide-react';
import ChatLayout from '../components/ChatLayout';

const TIME_PERIODS = [
  {
    id: 'morning',
    label: 'Morning',
    range: '8:00 AM - 12:00 PM',
    icon: Sun,
    iconBg: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    borderBg: 'border-white dark:border-background-dark',
  },
  {
    id: 'afternoon',
    label: 'Afternoon',
    range: '12:00 PM - 5:00 PM',
    icon: Sunset,
    iconBg: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    borderBg: 'border-white dark:border-background-dark',
  },
  {
    id: 'evening',
    label: 'Evening',
    range: '5:00 PM - 9:00 PM',
    icon: Moon,
    iconBg: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
    borderBg: 'border-white dark:border-background-dark',
  },
  {
    id: 'night',
    label: 'Night',
    range: '9:00 PM - 8:00 AM',
    icon: BedDouble,
    iconBg: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
    borderBg: 'border-white dark:border-background-dark',
  },
];

function ScheduleTimeline() {
  const [selectedLabel, setSelectedLabel] = useState('Today');

  return (
    <div className="lg:col-span-2 space-y-10">
      {/* Date header */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Today's Schedule</h2>
          <p className="text-gray-400 text-sm mt-1">Thursday, October 24, 2023</p>
        </div>
        <div className="flex items-center gap-3 bg-card-dark p-1 rounded-lg border border-sidebar-border shadow-sm">
          <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-sidebar-hover text-gray-400">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-semibold px-2 text-white">{selectedLabel}</span>
          <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-sidebar-hover text-gray-400">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute top-0 bottom-0 left-[19px] w-0.5 bg-sidebar-border -z-10" />

        {/* Morning - Taken */}
        <div className="flex items-start gap-6 relative">
          <div className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full ${TIME_PERIODS[0].iconBg} flex items-center justify-center border-4 ${TIME_PERIODS[0].borderBg} z-10`}>
              <Sun className="w-5 h-5" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-4 pt-1">
              Morning <span className="text-sm font-normal text-gray-400 ml-2">8:00 AM - 12:00 PM</span>
            </h3>
            <div className="bg-card-dark border border-sidebar-border rounded-xl p-5 shadow-sm mb-4 opacity-70">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Pill className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg line-through decoration-gray-500">Lisinopril</h4>
                    <p className="text-sm text-gray-400">10 mg • Take with food</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-400 bg-green-500/20 px-3 py-1.5 rounded-full">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-bold">Taken at 8:30 AM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Afternoon - Empty */}
        <div className="flex items-start gap-6 relative mt-10">
          <div className="absolute -top-10 bottom-0 left-[19px] w-0.5 bg-sidebar-border -z-10" />
          <div className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full ${TIME_PERIODS[1].iconBg} flex items-center justify-center border-4 ${TIME_PERIODS[1].borderBg} z-10`}>
              <Sunset className="w-5 h-5" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-4 pt-1">
              Afternoon <span className="text-sm font-normal text-gray-400 ml-2">12:00 PM - 5:00 PM</span>
            </h3>
            <div className="p-4 rounded-lg border border-dashed border-sidebar-border text-center">
              <p className="text-sm text-gray-400">No medications scheduled.</p>
            </div>
          </div>
        </div>

        {/* Evening - Metformin (next dose) */}
        <div className="flex items-start gap-6 relative mt-10">
          <div className="absolute -top-10 bottom-0 left-[19px] w-0.5 bg-sidebar-border -z-10" />
          <div className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full ${TIME_PERIODS[2].iconBg} flex items-center justify-center border-4 ${TIME_PERIODS[2].borderBg} z-10`}>
              <Moon className="w-5 h-5" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-4 pt-1">
              Evening <span className="text-sm font-normal text-gray-400 ml-2">5:00 PM - 9:00 PM</span>
            </h3>
            <div className="bg-card-dark border-l-4 border-l-primary border-y border-r border-sidebar-border rounded-xl p-5 shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Pill className="w-20 h-20 text-primary" />
              </div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Pill className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">Metformin</h4>
                    <p className="text-sm text-gray-400 mb-1">500 mg • With dinner</p>
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                      <Clock className="w-3.5 h-3.5" />
                      Next dose in 2h 45m
                    </div>
                  </div>
                </div>
                <button className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-primary hover:bg-blue-600 text-white font-semibold transition-all shadow hover:shadow-md">
                  <CheckCircle className="w-4 h-4" />
                  Mark as Taken
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Night - Aspirin */}
        <div className="flex items-start gap-6 relative mt-10">
          <div className="absolute -top-10 bottom-0 left-[19px] w-0.5 bg-sidebar-border -z-10" />
          <div className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full ${TIME_PERIODS[3].iconBg} flex items-center justify-center border-4 ${TIME_PERIODS[3].borderBg} z-10`}>
              <BedDouble className="w-5 h-5" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-4 pt-1">
              Night <span className="text-sm font-normal text-gray-400 ml-2">9:00 PM - 8:00 AM</span>
            </h3>
            <div className="bg-card-dark border border-sidebar-border rounded-xl p-5 shadow-sm mb-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-sidebar-hover flex items-center justify-center text-gray-400">
                    <Pill className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">Aspirin</h4>
                    <p className="text-sm text-gray-400">81 mg • Before bed</p>
                  </div>
                </div>
                <button className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-sidebar-border text-gray-300 font-medium hover:bg-sidebar-hover transition-colors">
                  Mark as Taken
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdherenceScoreCard() {
  const percentage = 85;
  return (
    <div className="bg-card-dark rounded-xl border border-sidebar-border shadow-sm p-6">
      <h3 className="font-bold text-white mb-2">Adherence Score</h3>
      <p className="text-xs text-gray-400 mb-6">Weekly medication tracking</p>
      <div className="flex flex-col items-center justify-center">
        <div
          className="w-48 h-48 rounded-full relative flex items-center justify-center"
          style={{
            background: `conic-gradient(#137fec ${percentage}%, #334155 0)`,
          }}
        >
          <div className="bg-background-dark rounded-full w-36 h-36 flex flex-col items-center justify-center">
            <span className="text-4xl font-extrabold text-white">85%</span>
            <span className="text-xs font-semibold text-green-400 uppercase tracking-wide mt-1">Excellent</span>
          </div>
        </div>
        <p className="text-center text-sm text-gray-300 mt-6 px-4">
          You're doing great! You've taken <strong className="text-white">12 of 14</strong> scheduled doses this week.
        </p>
      </div>
    </div>
  );
}

function UpcomingRefillsCard() {
  const refills = [
    { name: 'Lisinopril', daysLeft: 3, urgent: true },
    { name: 'Metformin', daysLeft: 12, urgent: false },
  ];

  return (
    <div className="bg-card-dark rounded-xl border border-sidebar-border shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-white">Upcoming Refills</h3>
        <a href="#" className="text-xs font-bold text-primary hover:underline">
          View All
        </a>
      </div>
      <div className="space-y-3">
        {refills.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between p-3 rounded-lg bg-sidebar-hover/50 border border-sidebar-border"
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded flex items-center justify-center ${item.urgent ? 'bg-red-500/20 text-red-400' : 'bg-primary/20 text-primary'}`}>
                <Package className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{item.name}</p>
                <p className={`text-xs font-medium ${item.urgent ? 'text-red-400' : 'text-gray-400'}`}>
                  {item.daysLeft} days left
                </p>
              </div>
            </div>
            <button className="text-xs bg-card-dark border border-sidebar-border px-2 py-1 rounded font-semibold text-gray-200 hover:text-primary hover:border-primary transition-colors">
              Order
            </button>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 flex items-center justify-center gap-2 py-2 text-sm font-semibold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
        <ShoppingCart className="w-4 h-4" />
        Request Refill for All
      </button>
    </div>
  );
}

function NeedAssistanceCard() {
  return (
    <div className="bg-gradient-to-br from-primary to-blue-600 rounded-xl shadow-md p-6 text-white relative overflow-hidden">
      <MessageCircle className="absolute -bottom-4 -right-4 w-24 h-24 opacity-10 rotate-12" />
      <h3 className="font-bold text-lg mb-2 relative z-10">Need Assistance?</h3>
      <p className="text-blue-100 text-sm mb-4 relative z-10">
        Our AI assistant can help you reschedule doses or answer medication questions.
      </p>
      <Link
        to="/chat"
        className="relative z-10 inline-flex bg-white text-primary text-sm font-bold py-2 px-4 rounded-lg shadow-sm hover:bg-blue-50 transition-colors"
      >
        Chat with MediAI
      </Link>
    </div>
  );
}

export default function MedicineReminder() {
  return (
    <ChatLayout>
      <div className="flex-1 overflow-y-auto">
        <main className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <ScheduleTimeline />
            <div className="space-y-6">
              <AdherenceScoreCard />
              <UpcomingRefillsCard />
              <NeedAssistanceCard />
            </div>
          </div>
        </main>
      </div>
    </ChatLayout>
  );
}
