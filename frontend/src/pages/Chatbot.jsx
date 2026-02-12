import { useState, useRef, useEffect } from 'react';
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
import { chatAPI } from '../services/api';

// Start with empty conversation
const INITIAL_MESSAGES = [];

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

function ChatComposer({ onSendMessage }) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <footer className="p-6 pt-2 bg-sidebar flex-shrink-0">
      <div className="relative flex w-full items-end rounded-xl bg-sidebar-hover border border-sidebar-border focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all shadow-lg">
        <button className="p-3 text-muted hover:text-white transition-colors self-end mb-0.5">
          <PlusCircle className="w-5 h-5" />
        </button>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
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
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="ml-2 flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-white hover:bg-blue-600 shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
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

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-sidebar-hover flex items-center justify-center mb-4">
            <Activity className="w-8 h-8 text-muted" />
          </div>
          <p className="text-white text-sm font-semibold mb-2">No Health Data Yet</p>
          <p className="text-muted text-xs leading-relaxed max-w-[240px]">
            Start a conversation with the AI assistant to receive personalized health insights and recommendations.
          </p>
        </div>
      </div>
    </aside>
  );
}

export default function Chatbot() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (content) => {
    // Get current time
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Add user message
    const userMessage = {
      id: crypto.randomUUID(),
      type: 'user',
      content: content,
      time: time,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkv4vcFz8KDsmGpfU3pVy6ZJh5z997ZJYeCKNEIQxq99GBj3o1fNlIG-k7gCaYHsnt4tCkKMkSeFcQSFH-8QlGqPhPxvR6n7CAOLGytqvlwvWz8rFeVwXyv-tNlI-QDRfZyOWM_TZB-tQ_xbBy1-jK1PdQ1f4eWsFWyj2tPzJ26751JuMDcwrsp8menuQUoML5AmxqNfT1ezcYhHjAuhY1T5YJbNpAd_aV7iBm0uFkLKTN4MW2rNIyNNKEyBYyGtRE1g37wKgDIzg',
    };

    // Optimistically update UI
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    // Show typing indicator
    setIsTyping(true);

    try {
      // Backend maintains short per-user history; we just send the latest message.
      const response = await chatAPI.sendSimpleMessage(content);
      console.log('Full Backend Response:', response);

      const aiMessage = {
        id: crypto.randomUUID(),
        type: 'assistant',
        content: response?.reply ?? "No response received from AI.",
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA94h3IYI8Q6uNTNr6IN9L_pCWz_bAHhfvSVPQxriTMoD3eLnp9OeQrxL3gAUa8QBcgccv4lImUm8UtfbtwsKKufpSaKMkzqMplzUxE_rwtk2kD11mD5WDj-b-8E6Fm7AnIt8cBBhQH31vsJri6dE9uw_OLS1zNINrlzG6bEbGoybuP9qk7B4LDLWGrCCvXyMTlbrNB5M_A4BPaRs5W_W7KPmw4BS1Crvhd5wJ6VRSQvjZP9n_T2_yMGtTox6ZHcWlL5cuulwrkMks',
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);

      // Fallback message on error
      const errorMessage = {
        id: crypto.randomUUID(),
        type: 'assistant', // Use assistant type to show bubble
        content: "AI service is temporarily unavailable. Please try again.",
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA94h3IYI8Q6uNTNr6IN9L_pCWz_bAHhfvSVPQxriTMoD3eLnp9OeQrxL3gAUa8QBcgccv4lImUm8UtfbtwsKKufpSaKMkzqMplzUxE_rwtk2kD11mD5WDj-b-8E6Fm7AnIt8cBBhQH31vsJri6dE9uw_OLS1zNINrlzG6bEbGoybuP9qk7B4LDLWGrCCvXyMTlbrNB5M_A4BPaRs5W_W7KPmw4BS1Crvhd5wJ6VRSQvjZP9n_T2_yMGtTox6ZHcWlL5cuulwrkMks',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      // Also log the full response for debugging as requested
      // Since response is local to try block, we can't log it here easily without refactoring
      // But we can rely on network tab or valid response logging
      setIsTyping(false);
    }
  };

  return (
    <ChatLayout>
      <div className="flex-1 flex h-full overflow-hidden">
        {/* Central Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          <ChatHeader />

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            {messages.length === 0 && !isTyping ? (
              /* Empty State */
              <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Bot className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-white text-xl font-bold mb-2">Welcome to MediAI</h3>
                <p className="text-muted text-sm max-w-md leading-relaxed">
                  Your AI health assistant is ready to help. Describe your symptoms or ask health-related questions to get started.
                </p>
              </div>
            ) : (
              <>
                {/* Date Separator - Only show when there are messages */}
                {messages.length > 0 && (
                  <div className="flex justify-center">
                    <span className="px-3 py-1 rounded-full bg-sidebar-hover text-muted text-xs font-medium">
                      Today, {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}

                {/* Messages */}
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}

                {/* Typing Indicator */}
                {isTyping && <TypingIndicator />}
              </>
            )}

            {/* Bottom spacer and scroll anchor */}
            <div ref={messagesEndRef} className="h-4 w-full" />
          </div>

          <ChatComposer onSendMessage={handleSendMessage} />
        </div>

        {/* Right Sidebar */}
        <HealthInsightsPanel />
      </div>
    </ChatLayout>
  );
}
