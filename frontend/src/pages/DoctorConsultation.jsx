import {
  Stethoscope,
  ArrowRight,
  CheckCircle,
  Brain,
  Sparkles,
  Check,
  Video,
  MapPin,
  Navigation,
  Info,
} from 'lucide-react';
import ChatLayout from '../components/ChatLayout';

function EmergencyBanner() {
  return (
    <div className="w-full">
      <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-red-900/50 bg-red-900/10 p-5 md:flex-row md:items-center">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-900/40 text-red-400">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-white text-base font-bold leading-tight">Medical Emergency?</p>
            <p className="text-red-200/70 text-sm font-normal leading-normal">
              If you are experiencing chest pain, difficulty breathing, or severe symptoms, do not wait.
            </p>
          </div>
        </div>
        <a
          href="tel:911"
          className="group flex shrink-0 items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-700"
        >
          Call 911
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  );
}

function AIAssessmentCard() {
  return (
    <div className="rounded-xl bg-surface-dark p-6 shadow-sm border border-gray-800">
      <div className="flex items-start gap-4">
        <div className="mt-1 text-primary">
          <Brain className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white mb-1">AI Assessment</h3>
          <p className="text-muted text-base font-normal leading-relaxed">
            Based on your reported symptoms of <span className="text-white font-medium">mild fever (100.2°F)</span> and{' '}
            <span className="text-white font-medium">sore throat</span>, our AI engine suggests a low-risk viral
            infection. We have identified three potential paths for care below.
          </p>
        </div>
      </div>
    </div>
  );
}

function SelfCareCard() {
  const items = [
    'Rest and hydration (8-10 glasses/day)',
    'Monitor temperature every 4 hours',
    'Salt water gargle for throat relief',
  ];

  return (
    <div className="flex flex-col rounded-xl border border-sidebar-border bg-surface-dark overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full">
      <div className="bg-sidebar-hover p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <span className="text-white font-bold text-lg">Self-Care</span>
          <Sparkles className="w-5 h-5 text-gray-400" />
        </div>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mt-1">Low Severity</p>
      </div>
      <div className="p-6 flex flex-col flex-1 justify-between gap-6">
        <div className="flex flex-col gap-4">
          <p className="text-muted text-sm">Recommended for mild symptoms that can be managed at home.</p>
          <ul className="flex flex-col gap-3">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-200">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <button className="w-full py-2.5 rounded-lg border border-gray-600 text-white font-bold text-sm hover:bg-sidebar-hover transition-colors">
          View Detailed Guide
        </button>
      </div>
    </div>
  );
}

function OnlineConsultationCard() {
  return (
    <div className="relative flex flex-col rounded-xl border-2 border-primary bg-surface-dark overflow-hidden shadow-[0_0_20px_rgba(19,127,236,0.15)] h-full scale-100 lg:scale-105 z-10">
      <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-20">
        AI RECOMMENDED
      </div>
      <div
        className="h-40 w-full bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuACOMo5xOvXjp9bCS01Ib7DTDBqPr_yT7y1SESW6gtB-O8RKQ1n5eUSZ7BqkjShkWJJCk_3lw1BJ3atIyxpQ3lKEEcr4hATFSGCM6TWmoIbjtLL0nmngRGtJFGKgGyu6j9w8ptjzq3oefyh2OEqXtwQJs5ozFAAEuxfzf7eZo1sPdN9_JxRrbqg5l4aJ4uyhwI7C2rMyORQvXAdBDr9d5ATnBRT9Uz5Og0vSfExkVPbFI3bZKYS5JdwM9-StE_0uyVtOZTxZr1nEr8')",
        }}
      >
        <div className="w-full h-full bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
          <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Doctors Available Now
          </div>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1 justify-between gap-6">
        <div>
          <h3 className="text-white text-xl font-bold leading-tight mb-2">Online Consultation</h3>
          <p className="text-muted text-sm mb-4">
            Speak with a GP within 15 minutes. Suitable for prescription needs and professional advice.
          </p>
          <div className="flex items-center gap-2 text-xs font-medium text-primary bg-primary/10 w-fit px-2 py-1 rounded">
            <Video className="w-4 h-4" />
            Video or Audio Call
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-white text-sm font-bold shadow-lg shadow-primary/30 hover:bg-blue-600 transition-colors">
            Book Video Call
            <ArrowRight className="w-4 h-4" />
          </button>
          <div className="text-center">
            <span className="text-xs text-gray-400">Wait time: ~8 mins</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PhysicalVisitCard() {
  return (
    <div className="flex flex-col rounded-xl border border-sidebar-border bg-surface-dark overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full">
      <div className="relative h-32 w-full bg-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 opacity-60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center shadow-lg text-white">
            <MapPin className="w-4 h-4" />
          </div>
        </div>
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-6 grid-rows-4 h-full w-full">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="border border-gray-600" />
            ))}
          </div>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1 justify-between gap-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white text-lg font-bold">Physical Visit</h3>
            <span className="text-xs font-bold text-gray-400 bg-gray-800 px-2 py-1 rounded">0.8 mi</span>
          </div>
          <p className="text-muted text-sm">If symptoms worsen or persist.</p>
          <div className="mt-4 p-3 rounded-lg bg-sidebar-hover border border-sidebar-border">
            <p className="text-white text-sm font-bold">City Care Clinic</p>
            <p className="text-gray-400 text-xs mt-1">Dr. Sarah Smith • Open until 8PM</p>
          </div>
        </div>
        <button className="w-full py-2.5 rounded-lg border border-gray-600 text-white font-bold text-sm hover:bg-sidebar-hover transition-colors flex items-center justify-center gap-2">
          <Navigation className="w-4 h-4" />
          Get Directions
        </button>
      </div>
    </div>
  );
}

function Disclaimer() {
  return (
    <footer className="mt-8 border-t border-sidebar-border pt-6 pb-12">
      <div className="flex gap-3 items-start p-4 rounded-lg bg-blue-900/10">
        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <p className="text-xs text-gray-400 leading-relaxed">
          <strong>Disclaimer:</strong> MediAI provides health information for educational purposes only and does not
          replace professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or
          other qualified health provider with any questions you may have regarding a medical condition.
        </p>
      </div>
    </footer>
  );
}

export default function DoctorConsultation() {
  return (
    <ChatLayout>
      <div className="flex-1 overflow-y-auto">
        <div className="w-full px-6 py-8 md:px-10 lg:px-16 lg:py-10 max-w-[1200px] mx-auto flex flex-col gap-6">
          {/* Emergency Banner */}
          <EmergencyBanner />

          {/* Page Heading & Summary */}
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <CheckCircle className="w-4 h-4" />
                <span>Analysis Complete</span>
              </div>
              <h1 className="text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">
                Care Path Analysis
              </h1>
            </div>
            <AIAssessmentCard />
          </div>

          {/* Recommendations Section */}
          <div>
            <h2 className="text-white tracking-tight text-2xl font-bold leading-tight mb-6">Recommended Paths</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              <SelfCareCard />
              <OnlineConsultationCard />
              <PhysicalVisitCard />
            </div>
          </div>

          {/* Footer Disclaimer */}
          <Disclaimer />
        </div>
      </div>
    </ChatLayout>
  );
}
