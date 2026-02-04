import { useState } from 'react';
import {
  Bot,
  Lock,
  MoreVertical,
  PlusCircle,
  Paperclip,
  Image,
  Send,
  CheckCircle,
  Activity,
  AlertTriangle,
  RotateCw,
  Frown,
  Droplets,
  CalendarClock,
} from 'lucide-react';
import ChatLayout from '../components/ChatLayout';

// Mock chat messages
const INITIAL_MESSAGES = [
  {
    id: 1,
    type: 'user',
    content: "I've had a persistent headache for 3 days and some dizziness. It seems to get worse when I stand up quickly.",
    time: '10:24 AM',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHXThz0TzXFctWssJfz6q4dfXJG1wyfsD0WkNvXdFLKVDuLzDKcYs3gd8SHXMuQn3QJoLgL1Dsse7piSSaZizzllTmTyh_QEM43p07imUBaw2pouSY44WB89tnXgPhXwzJOE0uaCU3OBFsCBEGdNNXO4aLgAlh-n4WERA5UmJs_JmfNI3kSWz09h_oizQtP5cnkzBEWmEhhw0Oh16eiXyPtB9aRLQkBUIDiKweaaJ4Wx3Cta7p-iFSYK0uJFwWPeb_ausBmGVPvpY',
  },
  {
    id: 2,
    type: 'assistant',
    content: null,
    richContent: (
      <>
        <p className="text-base font-normal leading-relaxed">
          I understand. Based on your description, I am logging these symptoms. The{' '}
          <span className="font-bold text-primary">worsening upon standing</span> is a specific detail
          known as orthostatic hypotension or positional dizziness.
        </p>
        <p className="text-base font-normal leading-relaxed mt-3">To help me analyze this further:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-gray-300">
          <li>Have you been drinking enough water lately?</li>
          <li>Do you feel any nausea along with the dizziness?</li>
        </ul>
      </>
    ),
    time: '10:24 AM',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA94h3IYI8Q6uNTNr6IN9L_pCWz_bAHhfvSVPQxriTMoD3eLnp9OeQrxL3gAUa8QBcgccv4lImUm8UtfbtwsKKufpSaKMkzqMplzUxE_rwtk2kD11mD5WDj-b-8E6Fm7AnIt8cBBhQH31vsJri6dE9uw_OLS1zNINrlzG6bEbGoybuP9qk7B4LDLWGrCCvXyMTlbrNB5M_A4BPaRs5W_W7KPmw4BS1Crvhd5wJ6VRSQvjZP9n_T2_yMGtTox6ZHcWlL5cuulwrkMks',
  },
  {
    id: 3,
    type: 'system',
    content: "Symptoms 'Headache' and 'Dizziness' logged to your profile.",
  },
  {
    id: 4,
    type: 'user',
    content: "I haven't been drinking much water, no. And slightly nauseous this morning.",
    time: '10:25 AM',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkv4vcFz8KDsmGpfU3pVy6ZJh5z997ZJYeCKNEIQxq99GBj3o1fNlIG-k7gCaYHsnt4tCkKMkSeFcQSFH-8QlGqPhPxvR6n7CAOLGytqvlwvWz8rFeVwXyv-tNlI-QDRfZiOWM_TZB-tQ_xbBy1-jK1PdQ1f4eWsFWyj2tPzJ26751JuMDcwrsp8menuQUoML5AmxqNfT1ezcYhHjAuhY1T5YJbNpAd_aV7iBm0uFkLKTN4MW2rNIyNNKEyBYyGtRE1g37wKgDIzg',
  },
];

function ChatHeader() {
  return (
    <header className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-sidebar-border bg-sidebar/95 backdrop-blur z-10">
      <div className="flex items-center gap-4 text-white">
        <div className="w-8 h-8 text-primary flex items-center justify-center bg-primary/10 rounded-lg">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-white text-lg font-bold leading-tight">AI Health Chatbot</h2>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-muted font-medium">Active Session</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
          <Lock className="w-4 h-4 text-green-500" />
          <span className="text-green-500 text-xs font-bold uppercase tracking-wide">HIPAA Secure</span>
        </div>
        <button className="flex items-center justify-center w-10 h-10 rounded-lg bg-sidebar-hover text-white hover:bg-primary hover:text-white transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}

function MessageBubble({ message }) {
  if (message.type === 'system') {
    return (
      <div className="flex justify-center my-2">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-sidebar-hover/50 border border-sidebar-border text-muted text-sm">
          <CheckCircle className="w-4 h-4" />
          <span>{message.content}</span>
        </div>
      </div>
    );
  }

  if (message.type === 'user') {
    return (
      <div className="flex items-end gap-3 justify-end group">
        <div className="flex flex-col gap-1 items-end max-w-[80%]">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-muted text-xs">You</p>
          </div>
          <div className="rounded-2xl rounded-tr-none px-5 py-4 bg-primary text-white shadow-md">
            <p className="text-base font-medium leading-relaxed">{message.content}</p>
          </div>
          <p className="text-muted text-[11px] opacity-0 group-hover:opacity-100 transition-opacity">
            {message.time}
          </p>
        </div>
        <div
          className="w-10 h-10 rounded-full shrink-0 border-2 border-sidebar-border bg-cover bg-center"
          style={{ backgroundImage: `url('${message.avatar}')` }}
        />
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 group">
      <div
        className="w-10 h-10 rounded-full shrink-0 border-2 border-primary/30 shadow-[0_0_15px_rgba(19,127,236,0.3)] bg-cover bg-center"
        style={{ backgroundImage: `url('${message.avatar}')` }}
      />
      <div className="flex flex-col gap-1 items-start max-w-[80%]">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-muted text-xs">MediAI Assistant</p>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sidebar-hover text-muted">BOT</span>
        </div>
        <div className="rounded-2xl rounded-tl-none px-5 py-4 bg-sidebar-hover text-white shadow-sm border border-sidebar-border/50">
          {message.richContent || <p className="text-base font-normal leading-relaxed">{message.content}</p>}
        </div>
        <p className="text-muted text-[11px] opacity-0 group-hover:opacity-100 transition-opacity">
          {message.time}
        </p>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-8 h-8 rounded-full shrink-0 opacity-70 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDgL4ptd60y86EhIXQDCiZD9RpNBtBm396Q6hAhb1I-CHBSP5nOspjRXV0NFY74qVWIQax-G22iORHuid5cw07iQl_ohLWKZSM-TI3HnNBW4WDNZTSCVlvpO9Uh5Us5LHA4KzRLEuYGdMFGeqCjQqDrWwBUN1pa3FtoC2VmgHz7JYniG2PeO3g6kAihTrMkQwL-PcM5tqoBB4MDYNcjn6Y-gLPKnmpM4Crr_769SZjOjYk2aoqRa2vkIpiohFxE0-Iaz9y1jLPma1A')",
        }}
      />
      <div className="flex gap-1 px-3 py-2 bg-sidebar-hover rounded-xl">
        <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" />
        <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce [animation-delay:75ms]" />
        <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce [animation-delay:150ms]" />
      </div>
    </div>
  );
}

function ChatComposer() {
  const [message, setMessage] = useState('');

  return (
    <footer className="p-6 pt-2 bg-sidebar flex-shrink-0">
      <div className="relative flex w-full items-end rounded-xl bg-sidebar-hover border border-sidebar-border focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all shadow-lg">
        <button className="p-3 text-muted hover:text-white transition-colors self-end mb-0.5">
          <PlusCircle className="w-5 h-5" />
        </button>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 bg-transparent border-none text-white placeholder-muted focus:ring-0 resize-none py-4 max-h-32 min-h-[56px] focus:outline-none"
          placeholder="Describe your symptoms or ask a question..."
          rows={1}
        />
        <div className="flex items-center gap-2 pr-3 pb-3 self-end">
          <button className="p-2 text-muted hover:text-white hover:bg-white/5 rounded-lg transition-colors" title="Upload File">
            <Paperclip className="w-5 h-5" />
          </button>
          <button className="p-2 text-muted hover:text-white hover:bg-white/5 rounded-lg transition-colors" title="Upload Image">
            <Image className="w-5 h-5" />
          </button>
          <button className="ml-2 flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-white hover:bg-blue-600 shadow-lg shadow-blue-500/20 transition-all">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
      <p className="text-center text-muted text-[10px] mt-2">
        MediAI can make mistakes. Consider checking important information.
      </p>
    </footer>
  );
}

function HealthInsightsPanel() {
  return (
    <aside className="w-[340px] flex-shrink-0 flex-col border-l border-sidebar-border bg-sidebar h-full overflow-y-auto hidden xl:flex">
      <div className="p-6">
        <h3 className="text-white text-lg font-bold mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Health Insights
        </h3>

        {/* Health Status Widget */}
        <div className="bg-[#1a2027] rounded-xl p-5 border border-sidebar-border mb-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:bg-green-500/20" />
          <h4 className="text-muted text-xs font-bold uppercase tracking-wider mb-2">Current Status</h4>
          <div className="flex items-center gap-3 mb-3">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 border border-green-500/30 text-green-500">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-white text-xl font-bold">Stable</p>
              <p className="text-green-400 text-xs font-medium">Low Risk Level</p>
            </div>
          </div>
          <p className="text-sm text-muted leading-normal">
            Vitals estimated within normal range. Monitor hydration levels closely.
          </p>
        </div>

        {/* Detected Symptoms */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white text-sm font-bold">Detected Symptoms</h4>
            <span className="text-xs text-primary cursor-pointer hover:underline">View History</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              Headache (3 Days)
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-medium flex items-center gap-1">
              <RotateCw className="w-3.5 h-3.5" />
              Dizziness
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-sidebar-hover text-muted text-xs font-medium flex items-center gap-1">
              <Frown className="w-3.5 h-3.5" />
              Nausea
            </span>
          </div>
        </div>

        {/* Recommended Actions */}
        <div className="mb-6">
          <h4 className="text-white text-sm font-bold mb-3">Recommended Actions</h4>
          <div className="flex flex-col gap-3">
            <div className="flex gap-3 p-3 rounded-lg bg-sidebar-hover/50 border border-sidebar-border hover:border-primary/50 transition-colors cursor-pointer group">
              <div className="mt-0.5 text-blue-400 bg-blue-400/10 rounded p-1 h-fit">
                <Droplets className="w-4 h-4" />
              </div>
              <div>
                <p className="text-white text-sm font-medium group-hover:text-primary transition-colors">
                  Hydrate Immediately
                </p>
                <p className="text-muted text-xs mt-0.5">Drink at least 500ml of water now.</p>
              </div>
            </div>
            <div className="flex gap-3 p-3 rounded-lg bg-sidebar-hover/50 border border-sidebar-border hover:border-primary/50 transition-colors cursor-pointer group">
              <div className="mt-0.5 text-purple-400 bg-purple-400/10 rounded p-1 h-fit">
                <CalendarClock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-white text-sm font-medium group-hover:text-primary transition-colors">
                  Log Blood Pressure
                </p>
                <p className="text-muted text-xs mt-0.5">Check if available to rule out hypotension.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pain Trend Chart */}
        <div>
          <h4 className="text-white text-sm font-bold mb-3">Pain Trend</h4>
          <div className="h-32 w-full rounded-xl bg-sidebar-hover border border-sidebar-border relative overflow-hidden flex items-end justify-between px-2 pb-2 pt-8">
            <div className="w-1/6 bg-blue-500/20 h-[30%] rounded-t mx-0.5" />
            <div className="w-1/6 bg-blue-500/30 h-[45%] rounded-t mx-0.5" />
            <div className="w-1/6 bg-blue-500/40 h-[40%] rounded-t mx-0.5" />
            <div className="w-1/6 bg-blue-500/60 h-[60%] rounded-t mx-0.5" />
            <div className="w-1/6 bg-blue-500/80 h-[75%] rounded-t mx-0.5" />
            <div className="w-1/6 bg-primary h-[85%] rounded-t mx-0.5 relative group">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-neutral-900 text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                8/10
              </div>
            </div>
            <div className="absolute inset-0 border-t border-white/5 top-1/3 pointer-events-none" />
            <div className="absolute inset-0 border-t border-white/5 top-2/3 pointer-events-none" />
          </div>
          <p className="text-right text-[10px] text-muted mt-1">Last 5 Days</p>
        </div>
      </div>
    </aside>
  );
}

export default function Chatbot() {
  const [messages] = useState(INITIAL_MESSAGES);
  const [isTyping] = useState(true);

  return (
    <ChatLayout>
      <div className="flex-1 flex h-full overflow-hidden">
        {/* Central Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          <ChatHeader />

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            {/* Date Separator */}
            <div className="flex justify-center">
              <span className="px-3 py-1 rounded-full bg-sidebar-hover text-muted text-xs font-medium">
                Today, 10:23 AM
              </span>
            </div>

            {/* Messages */}
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {/* Typing Indicator */}
            {isTyping && <TypingIndicator />}

            {/* Bottom spacer */}
            <div className="h-4 w-full" />
          </div>

          <ChatComposer />
        </div>

        {/* Right Sidebar */}
        <HealthInsightsPanel />
      </div>
    </ChatLayout>
  );
}
