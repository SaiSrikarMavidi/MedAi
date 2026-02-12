import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Calendar, PlusCircle, ArrowRight, Eye, Pill, ChevronLeft, ChevronRight, Sun, Sunset, Moon, BedDouble, Package, MessageCircle, UtensilsCrossed, Bookmark, Mic, CheckCircle, Info, RefreshCw, Droplets, Stethoscope, Brain, Sparkles, Check, Video, MapPin, Navigation, X, Clock, Phone, Bot, Lock, MoreVertical, Paperclip, Image, Send, Activity, Share2, Pin, Edit3, Archive, Trash2, ShoppingCart, Star, Filter, Plus, Minus, Upload, Truck, CreditCard, Shield, Camera, Repeat, FileText, Bell, Users, Settings, Target, Award, TrendingUp, Coffee, Salad, Apple, Dumbbell, Heart, ChevronDown } from 'lucide-react';
import { chatAPI, medicineAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

// Dynamic clinic data (shared with DoctorConsultation)
const NEARBY_CLINICS = [
        {
            id: 1,
    name: 'City Care Clinic',
    doctor: 'Dr. Sarah Smith',
    hours: 'Open until 8PM',
    distance: '0.8 mi',
    address: '123 Main St, Downtown',
    phone: '+1 (555) 123-4567',
    specialty: 'General Practice'
        },
        {
            id: 2,
    name: 'MediCenter Plus',
    doctor: 'Dr. Michael Chen',
    hours: 'Open until 10PM',
    distance: '1.2 mi',
    address: '456 Oak Ave, Midtown',
    phone: '+1 (555) 987-6543',
    specialty: 'Family Medicine'
        },
        {
            id: 3,
    name: 'HealthPoint Clinic',
    doctor: 'Dr. Emily Johnson',
    hours: 'Open 24/7',
    distance: '1.5 mi',
    address: '789 Pine Rd, Uptown',
    phone: '+1 (555) 456-7890',
    specialty: 'Urgent Care'
  },
  {
    id: 4,
    name: 'Wellness Medical Group',
    doctor: 'Dr. David Rodriguez',
    hours: 'Open until 6PM',
    distance: '2.1 mi',
    address: '321 Elm St, Westside',
    phone: '+1 (555) 234-5678',
    specialty: 'Internal Medicine'
  }
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

function ConsultationCard({ consultation, onClick, onUpdate }) {
  const isInProgress = consultation.status === 'in-progress';
  const [showDropdown, setShowDropdown] = useState(false);
  const [showToast, setShowToast] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const dropdownRef = useRef(null);
  const cardId = `card-${consultation.id}`;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const showNotification = (message, type = 'success') => {
    setShowToast({ message, type, id: Date.now() });
  };

  const handleDropdownClick = (e) => {
    e.stopPropagation();
    if (!isProcessing) {
      setShowDropdown(!showDropdown);
    }
  };

  const handleMenuAction = async (action, e) => {
    e.stopPropagation();

    if (isProcessing) return;

    setIsProcessing(true);
    setShowDropdown(false);

    try {
      switch (action) {
        case 'share':
          const shareText = `Check out my health consultation: "${consultation.title}" - ${consultation.summary.substring(0, 100)}...`;
          if (navigator.share) {
            await navigator.share({
              title: consultation.title,
              text: shareText,
              url: window.location.href
            });
            showNotification('Shared successfully!');
          } else if (navigator.clipboard) {
            await navigator.clipboard.writeText(shareText);
            showNotification('Consultation details copied to clipboard!');
          } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = shareText;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showNotification('Consultation details copied to clipboard!');
          }
          break;

        case 'pin':
          const updatedConsultation = { ...consultation, pinned: !consultation.pinned };
          await onUpdate(updatedConsultation);
          showNotification(
            updatedConsultation.pinned ? 'Consultation pinned!' : 'Consultation unpinned!'
          );
          break;

        case 'rename':
          const newTitle = prompt('Enter new consultation title:', consultation.title);
          if (newTitle && newTitle.trim() && newTitle.trim() !== consultation.title) {
            const renamedConsultation = { ...consultation, title: newTitle.trim() };
            await onUpdate(renamedConsultation);
            showNotification('Consultation renamed successfully!');
          }
          break;

        case 'archive':
          if (window.confirm('Are you sure you want to archive this consultation? You can still view it later.')) {
            const archivedConsultation = { ...consultation, archived: !consultation.archived };
            await onUpdate(archivedConsultation);
            showNotification(
              archivedConsultation.archived ? 'Consultation archived!' : 'Consultation unarchived!'
            );
          }
          break;

        case 'delete':
          if (window.confirm('Are you sure you want to permanently delete this consultation? This action cannot be undone.')) {
            await onUpdate(consultation, 'delete');
            showNotification('Consultation deleted!', 'info');
          }
          break;

        default:
          break;
      }
    } catch (error) {
      console.error(`Error performing ${action} on consultation ${consultation.id}:`, error);
      showNotification('Operation failed. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div id={cardId} className="relative flex flex-col p-5 rounded-xl bg-white dark:bg-card-dark border border-gray-300 dark:border-sidebar-border hover:border-primary/50 transition-colors group shadow-sm">
      {/* Toast Notification */}
      {showToast && (
        <div
          key={showToast.id}
          className={`absolute top-2 right-2 z-50 px-3 py-2 rounded-lg text-sm font-medium shadow-lg animate-[fadeIn_0.3s_ease-in-out] ${showToast.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
            showToast.type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
              'bg-blue-100 text-blue-800 border border-blue-200'
            }`}
        >
          {showToast.message}
        </div>
      )}

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="absolute inset-0 bg-black/5 dark:bg-white/5 rounded-xl flex items-center justify-center z-40">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="flex justify-between items-start mb-3">
        <div
          onClick={() => !isProcessing && onClick(consultation.id)}
          className={`flex flex-col gap-1 flex-1 ${isProcessing ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
        >
          <div className="flex items-center gap-2">
            {consultation.pinned && (
              <Pin className="w-4 h-4 text-primary" />
            )}
            <h3 className="text-gray-900 dark:text-white text-lg font-bold leading-snug group-hover:text-primary transition-colors">
              {consultation.title}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-gray-500 dark:text-muted text-xs font-medium">
            <Calendar className="w-4 h-4" />
            <span>{consultation.date}</span>
            {consultation.archived && (
              <>
                <span>•</span>
                <span className="text-orange-500">Archived</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={consultation.status} />
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={handleDropdownClick}
              disabled={isProcessing}
              className={`p-1.5 rounded-lg text-gray-400 dark:text-muted hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-sidebar-hover transition-colors ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {showDropdown && !isProcessing && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-surface-dark border border-gray-300 dark:border-sidebar-border rounded-lg shadow-lg z-50">
                <div className="py-1">
                  <button
                    onClick={(e) => handleMenuAction('share', e)}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-sidebar-hover transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                  <button
                    onClick={(e) => handleMenuAction('pin', e)}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-sidebar-hover transition-colors"
                  >
                    <Pin className="w-4 h-4" />
                    {consultation.pinned ? 'Unpin' : 'Pin'}
                  </button>
                  <button
                    onClick={(e) => handleMenuAction('rename', e)}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-sidebar-hover transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    Rename
                  </button>
                  <button
                    onClick={(e) => handleMenuAction('archive', e)}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-sidebar-hover transition-colors"
                  >
                    <Archive className="w-4 h-4" />
                    {consultation.archived ? 'Unarchive' : 'Archive'}
                  </button>
                  <hr className="my-1 border-gray-200 dark:border-sidebar-border" />
                  <button
                    onClick={(e) => handleMenuAction('delete', e)}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        onClick={() => !isProcessing && onClick(consultation.id)}
        className={`flex-1 ${isProcessing ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
      >
        <p className="text-gray-600 dark:text-muted text-sm leading-relaxed mb-6 line-clamp-2">
          {consultation.summary}
        </p>

        <div className="mt-auto flex justify-end">
          {isInProgress ? (
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-sidebar-hover hover:bg-gray-800 dark:hover:bg-card-hover text-white text-sm font-bold rounded-lg transition-colors border border-gray-600 dark:border-sidebar-border">
              <span>Resume Session</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button className="flex items-center gap-2 px-4 py-2 text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary text-sm font-bold transition-colors">
              <span>View Summary</span>
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ========== EMBEDDED CHATBOT ==========
function EmbeddedChatbot({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (message.trim()) {
      const now = new Date();
      const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      const userMessage = {
        id: messages.length + 1,
        type: 'user',
        content: message.trim(),
        time: time,
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkv4vcFz8KDsmGpfU3pVy6ZJh5z997ZJYeCKNEIQxq99GBj3o1fNlIG-k7gCaYHsnt4tCkKMkSeFcQSFH-8QlGqPhPxvR6n7CAOLGytqvlwvWz8rFeVwXyv-tNlI-QDRfZiOWM_TZB-tQ_xbBy1-jK1PdQ1f4eWsFWyj2tPzJ26751JuMDcwrsp8menuQUoML5AmxqNfT1ezcYhHjAuhY1T5YJbNpAd_aV7iBm0uFkLKTN4MW2rNIyNNKEyBYyGtRE1g37wKgDIzg',
      };
      setMessages(prev => [...prev, userMessage]);
      setMessage('');
      setIsTyping(true);

      try {
        const response = await chatAPI.sendSimpleMessage(message.trim());

        const aiMessage = {
          id: messages.length + 2,
          type: 'assistant',
          content: response.reply || "I apologize, but I'm having trouble connecting right now.",
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA94h3IYI8Q6uNTNr6IN9L_pCWz_bAHhfvSVPQxriTMoD3eLnp9OeQrxL3gAUa8QBcgccv4lImUm8UtfbtwsKKufpSaKMkzqMplzUxE_rwtk2kD11mD5WDj-b-8E6Fm7AnIt8cBBhQH31vsJri6dE9uw_OLS1zNINrlzG6bEbGoybuP9qk7B4LDLWGrCCvXyMTlbrNB5M_A4BPaRs5W_W7KPmw4BS1Crvhd5wJ6VRSQvjZP9n_T2_yMGtTox6ZHcWlL5cuulwrkMks',
        };
        setMessages(prev => [...prev, aiMessage]);
      } catch (error) {
        console.error("Chat error:", error);
        const errorMessage = {
          id: messages.length + 2,
          type: 'assistant',
          content: "Sorry, I'm unable to reach the server at the moment.",
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA94h3IYI8Q6uNTNr6IN9L_pCWz_bAHhfvSVPQxriTMoD3eLnp9OeQrxL3gAUa8QBcgccv4lImUm8UtfbtwsKKufpSaKMkzqMplzUxE_rwtk2kD11mD5WDj-b-8E6Fm7AnIt8cBBhQH31vsJri6dE9uw_OLS1zNINrlzG6bEbGoybuP9qk7B4LDLWGrCCvXyMTlbrNB5M_A4BPaRs5W_W7KPmw4BS1Crvhd5wJ6VRSQvjZP9n_T2_yMGtTox6ZHcWlL5cuulwrkMks',
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    };

    return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-white dark:bg-card-dark rounded-xl border border-gray-300 dark:border-sidebar-border shadow-lg overflow-hidden">
      {/* Chat Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-300 dark:border-sidebar-border bg-gray-50 dark:bg-sidebar/95">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 text-primary flex items-center justify-center bg-primary/10 rounded-lg">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-gray-900 dark:text-white text-lg font-bold leading-tight">AI Health Chatbot</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-gray-500 dark:text-muted font-medium">Active Session</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
            <Lock className="w-4 h-4 text-green-500" />
            <span className="text-green-500 text-xs font-bold uppercase tracking-wide">HIPAA Secure</span>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-sidebar-hover text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-primary hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-gray-50 dark:bg-background-dark">
        {messages.length === 0 && !isTyping ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Bot className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-neutral-900 dark:text-white text-xl font-bold mb-2">Welcome to MediAI</h3>
            <p className="text-neutral-500 dark:text-muted text-sm max-w-md leading-relaxed">
              Your AI health assistant is ready to help. Describe your symptoms or ask health-related questions to get started.
            </p>
          </div>
        ) : (
          <>
            {messages.length > 0 && (
              <div className="flex justify-center">
                <span className="px-3 py-1 rounded-full bg-neutral-200 dark:bg-sidebar-hover text-neutral-600 dark:text-muted text-xs font-medium">
                  Today, {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id}>
                {msg.type === 'user' ? (
                  <div className="flex items-end gap-3 justify-end group">
                    <div className="flex flex-col gap-1 items-end max-w-[80%]">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-neutral-500 dark:text-muted text-xs">You</p>
                      </div>
                      <div className="rounded-2xl rounded-tr-none px-5 py-4 bg-primary text-white shadow-md">
                        <p className="text-base font-medium leading-relaxed">{msg.content}</p>
                      </div>
                      <p className="text-neutral-500 dark:text-muted text-[11px] opacity-0 group-hover:opacity-100 transition-opacity">
                        {msg.time}
                      </p>
                    </div>
                    <div
                      className="w-10 h-10 rounded-full shrink-0 border-2 border-gray-300 dark:border-sidebar-border bg-cover bg-center"
                      style={{ backgroundImage: `url('${msg.avatar}')` }}
                    />
                  </div>
                ) : (
                  <div className="flex items-start gap-3 group">
                    <div
                      className="w-10 h-10 rounded-full shrink-0 border-2 border-primary/30 shadow-[0_0_15px_rgba(19,127,236,0.3)] bg-cover bg-center"
                      style={{ backgroundImage: `url('${msg.avatar}')` }}
                    />
                    <div className="flex flex-col gap-1 items-start max-w-[80%]">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-neutral-500 dark:text-muted text-xs">MediAI Assistant</p>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-neutral-200 dark:bg-sidebar-hover text-neutral-600 dark:text-muted">BOT</span>
                      </div>
                      <div className="rounded-2xl rounded-tl-none px-5 py-4 bg-white dark:bg-sidebar-hover text-neutral-900 dark:text-white shadow-sm border border-gray-300 dark:border-sidebar-border/50">
                        <p className="text-base font-normal leading-relaxed">{msg.content}</p>
                      </div>
                      <p className="text-neutral-500 dark:text-muted text-[11px] opacity-0 group-hover:opacity-100 transition-opacity">
                        {msg.time}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full shrink-0 opacity-70 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDgL4ptd60y86EhIXQDCiZD9RpNBtBm396Q6hAhb1I-CHBSP5nOspjRXV0NFY74qVWIQax-G22iORHuid5cw07iQl_ohLWKZSM-TI3HnNBW4WDNZTSCVlvpO9Uh5Us5LHA4KzRLEuYGdMFGeqCjQqDrWwBUN1pa3FtoC2VmgHz7JYniG2PeO3g6kAihTrMkQwL-PcM5tqoBB4MDYNcjn6Y-gLPKnmpM4Crr_769SZjOjYk2aoqRa2vkIpiohFxE0-Iaz9y1jLPma1A')",
                  }}
                />
                <div className="flex gap-1 px-3 py-2 bg-neutral-200 dark:bg-sidebar-hover rounded-xl">
                  <span className="w-1.5 h-1.5 bg-neutral-500 dark:bg-muted rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-neutral-500 dark:bg-muted rounded-full animate-bounce [animation-delay:75ms]" />
                  <span className="w-1.5 h-1.5 bg-neutral-500 dark:bg-muted rounded-full animate-bounce [animation-delay:150ms]" />
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} className="h-4 w-full" />
      </div>

      {/* Chat Input */}
      <footer className="p-6 pt-4 bg-white dark:bg-sidebar border-t border-gray-300 dark:border-sidebar-border">
        <div className="relative flex w-full items-end rounded-xl bg-neutral-100 dark:bg-sidebar-hover border border-gray-300 dark:border-sidebar-border focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all shadow-lg">
          <button className="p-3 text-neutral-500 dark:text-muted hover:text-neutral-900 dark:hover:text-white transition-colors self-end mb-0.5">
            <PlusCircle className="w-5 h-5" />
          </button>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-transparent border-none text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-muted focus:ring-0 resize-none py-4 max-h-32 min-h-[56px] focus:outline-none"
            placeholder="Describe your symptoms or ask a question..."
            rows={1}
          />
          <div className="flex items-center gap-2 pr-3 pb-3 self-end">
            <button className="p-2 text-neutral-500 dark:text-muted hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-white/5 rounded-lg transition-colors" title="Upload File">
              <Paperclip className="w-5 h-5" />
            </button>
            <button className="p-2 text-neutral-500 dark:text-muted hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-white/5 rounded-lg transition-colors" title="Upload Image">
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
        <p className="text-center text-neutral-500 dark:text-muted text-[10px] mt-2">
          MediAI can make mistakes. Consider checking important information.
        </p>
      </footer>
    </div>
  );
}

// ========== CARE PATH SECTION ==========
function CarePathSection() {
  const [showSelfCareModal, setShowSelfCareModal] = useState(false);
  const [showBookCallModal, setShowBookCallModal] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState(NEARBY_CLINICS[0]);

  const handleGetDirections = (clinic = selectedClinic) => {
    const destination = `${clinic.name}, ${clinic.address}`;
    const encodedDestination = encodeURIComponent(destination);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedDestination}`, '_blank');
  };

  return (
    <>
      {/* Emergency Banner */}
      <div className="w-full">
        <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20 p-5 md:flex-row md:items-center">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-red-800 dark:text-red-200 text-base font-bold leading-tight">Medical Emergency?</p>
              <p className="text-red-700 dark:text-red-300 text-sm font-normal leading-normal">
                If you are experiencing chest pain, difficulty breathing, or severe symptoms, do not wait.
              </p>
            </div>
          </div>
          <a
            href="tel:911"
            className="group flex shrink-0 items-center gap-2 rounded-lg bg-red-600 dark:bg-red-700 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-700 dark:hover:bg-red-800"
          >
            Call 911
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>

      {/* Page Heading & Summary */}
      <div className="flex flex-col gap-4 py-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <CheckCircle className="w-4 h-4" />
            <span>Analysis Complete</span>
          </div>
          <h1 className="text-gray-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">
            Care Path Analysis
          </h1>
        </div>
        <div className="rounded-xl bg-white dark:bg-surface-dark p-6 shadow-sm border border-gray-300 dark:border-gray-800">
          <div className="flex items-start gap-4">
            <div className="mt-1 text-primary">
              <Brain className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">AI Assessment</h3>
              <p className="text-gray-600 dark:text-muted text-base font-normal leading-relaxed">
                Based on your reported symptoms of <span className="text-gray-900 dark:text-white font-medium">mild fever (100.2°F)</span> and{' '}
                <span className="text-gray-900 dark:text-white font-medium">sore throat</span>, our AI engine suggests a low-risk viral
                infection. We have identified three potential paths for care below.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      <div>
        <h2 className="text-gray-900 dark:text-white tracking-tight text-2xl font-bold leading-tight mb-6">Recommended Paths</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Self-Care Card */}
          <div className="flex flex-col rounded-xl border border-neutral-200 dark:border-sidebar-border bg-white dark:bg-surface-dark overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full">
            <div className="bg-gray-100 dark:bg-sidebar-hover p-4 border-b border-gray-300 dark:border-sidebar-border">
              <div className="flex items-center justify-between">
                <span className="text-gray-900 dark:text-white font-bold text-lg">Self-Care</span>
                <Sparkles className="w-5 h-5 text-gray-400 dark:text-gray-400" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mt-1">Low Severity</p>
            </div>
            <div className="p-6 flex flex-col flex-1 justify-between gap-6">
              <div className="flex flex-col gap-4">
                <p className="text-gray-600 dark:text-muted text-sm">Recommended for mild symptoms that can be managed at home.</p>
                <ul className="flex flex-col gap-3">
                  <li className="flex items-start gap-3 text-sm text-neutral-700 dark:text-gray-200">
                    <Check className="w-5 h-5 text-green-500 shrink-0" />
                    <span>Rest and hydration (8-10 glasses/day)</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-neutral-700 dark:text-gray-200">
                    <Check className="w-5 h-5 text-green-500 shrink-0" />
                    <span>Monitor temperature every 4 hours</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-neutral-700 dark:text-gray-200">
                    <Check className="w-5 h-5 text-green-500 shrink-0" />
                    <span>Salt water gargle for throat relief</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => setShowSelfCareModal(true)}
                className="w-full py-2.5 rounded-lg border border-gray-400 dark:border-gray-600 text-gray-900 dark:text-white font-bold text-sm hover:bg-gray-100 dark:hover:bg-sidebar-hover transition-colors">
                View Detailed Guide
              </button>
            </div>
          </div>

          {/* Online Consultation Card */}
          <div className="relative flex flex-col rounded-xl border-2 border-primary bg-white dark:bg-surface-dark overflow-hidden shadow-[0_0_20px_rgba(19,127,236,0.15)] h-full scale-100 lg:scale-105 z-10">
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
                <h3 className="text-gray-900 dark:text-white text-xl font-bold leading-tight mb-2">Online Consultation</h3>
                <p className="text-gray-600 dark:text-muted text-sm mb-4">
                  Speak with a GP within 15 minutes. Suitable for prescription needs and professional advice.
                </p>
                <div className="flex items-center gap-2 text-xs font-medium text-primary bg-primary/10 w-fit px-2 py-1 rounded">
                  <Video className="w-4 h-4" />
                  Video or Audio Call
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setShowBookCallModal(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-white text-sm font-bold shadow-lg shadow-primary/30 hover:bg-blue-600 transition-colors">
                  Book Video Call
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="text-center">
                  <span className="text-xs text-neutral-400 dark:text-gray-400">Wait time: ~8 mins</span>
                </div>
              </div>
            </div>
          </div>

          {/* Physical Visit Card */}
          <div className="flex flex-col rounded-xl border border-neutral-200 dark:border-sidebar-border bg-white dark:bg-surface-dark overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full">
            <div className="relative h-32 w-full bg-gray-200 dark:bg-gray-800">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-900 opacity-60" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center shadow-lg text-white">
                  <MapPin className="w-4 h-4" />
                </div>
              </div>
              <div className="absolute inset-0 opacity-20">
                <div className="grid grid-cols-6 grid-rows-4 h-full w-full">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="border border-gray-400 dark:border-gray-600" />
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 flex flex-col flex-1 justify-between gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-neutral-900 dark:text-white text-lg font-bold">Physical Visit</h3>
                  <span className="text-xs font-bold text-neutral-500 dark:text-gray-400 bg-neutral-100 dark:bg-gray-800 px-2 py-1 rounded">{selectedClinic.distance}</span>
                </div>
                <p className="text-neutral-500 dark:text-muted text-sm">If symptoms worsen or persist.</p>
                <div className="mt-4 p-3 rounded-lg bg-neutral-100 dark:bg-sidebar-hover border border-gray-300 dark:border-sidebar-border">
                  <p className="text-neutral-900 dark:text-white text-sm font-bold">{selectedClinic.name}</p>
                  <p className="text-neutral-500 dark:text-gray-400 text-xs mt-1">{selectedClinic.doctor} • {selectedClinic.hours}</p>
                </div>
              </div>
              <button
                onClick={() => handleGetDirections()}
                className="w-full py-2.5 rounded-lg border border-neutral-300 dark:border-gray-600 text-neutral-900 dark:text-white font-bold text-sm hover:bg-neutral-100 dark:hover:bg-sidebar-hover transition-colors flex items-center justify-center gap-2">
                <Navigation className="w-4 h-4" />
                Get Directions
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <footer className="mt-8 border-t border-gray-300 dark:border-sidebar-border pt-6 pb-12">
        <div className="flex gap-3 items-start p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <p className="text-xs text-neutral-600 dark:text-gray-400 leading-relaxed">
            <strong>Disclaimer:</strong> MediAI provides health information for educational purposes only and does not
            replace professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or
            other qualified health provider with any questions you may have regarding a medical condition.
          </p>
        </div>
      </footer>

      {/* Self-Care Modal */}
      {showSelfCareModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-surface-dark rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-300 dark:border-sidebar-border">
            <div className="sticky top-0 bg-neutral-100 dark:bg-sidebar-hover p-6 border-b border-gray-300 dark:border-sidebar-border flex items-center justify-between">
              <h2 className="text-neutral-900 dark:text-white text-2xl font-bold">Self-Care Guide</h2>
              <button onClick={() => setShowSelfCareModal(false)} className="text-neutral-500 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-neutral-900 dark:text-white text-lg font-bold mb-3">Hydration</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3 text-neutral-700 dark:text-gray-300 text-sm">
                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span>Drink 8-10 glasses of water daily</span>
                  </li>
                  <li className="flex items-start gap-3 text-neutral-700 dark:text-gray-300 text-sm">
                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span>Include warm fluids like herbal tea or soup</span>
                  </li>
                  <li className="flex items-start gap-3 text-neutral-700 dark:text-gray-300 text-sm">
                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span>Avoid alcohol and caffeine which can dehydrate</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-neutral-900 dark:text-white text-lg font-bold mb-3">Rest & Recovery</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3 text-neutral-700 dark:text-gray-300 text-sm">
                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span>Get at least 8 hours of sleep</span>
                  </li>
                  <li className="flex items-start gap-3 text-neutral-700 dark:text-gray-300 text-sm">
                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span>Take short breaks throughout the day</span>
                  </li>
                  <li className="flex items-start gap-3 text-neutral-700 dark:text-gray-300 text-sm">
                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span>Avoid strenuous activities</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-neutral-900 dark:text-white text-lg font-bold mb-3">Symptom Management</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3 text-neutral-700 dark:text-gray-300 text-sm">
                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span>Monitor temperature every 4 hours</span>
                  </li>
                  <li className="flex items-start gap-3 text-neutral-700 dark:text-gray-300 text-sm">
                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span>Gargle with salt water 3-4 times daily</span>
                  </li>
                  <li className="flex items-start gap-3 text-neutral-700 dark:text-gray-300 text-sm">
                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span>Use a humidifier to ease breathing</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-neutral-900 dark:text-white text-lg font-bold mb-3">When to Seek Help</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3 text-neutral-700 dark:text-gray-300 text-sm">
                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span>Fever above 102°F (39°C)</span>
                  </li>
                  <li className="flex items-start gap-3 text-neutral-700 dark:text-gray-300 text-sm">
                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span>Symptoms lasting more than 7 days</span>
                  </li>
                  <li className="flex items-start gap-3 text-neutral-700 dark:text-gray-300 text-sm">
                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span>Difficulty breathing or chest pain</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="sticky bottom-0 bg-neutral-100 dark:bg-sidebar-hover p-6 border-t border-gray-300 dark:border-sidebar-border">
              <button
                onClick={() => setShowSelfCareModal(false)}
                className="w-full py-3 rounded-lg bg-primary text-white font-bold hover:bg-blue-600 transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Book Call Modal */}
      {showBookCallModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-surface-dark rounded-xl max-w-md w-full border border-primary shadow-[0_0_30px_rgba(19,127,236,0.3)]">
            <div className="bg-neutral-100 dark:bg-sidebar-hover p-6 border-b border-gray-300 dark:border-sidebar-border flex items-center justify-between">
              <h2 className="text-neutral-900 dark:text-white text-2xl font-bold">Book Video Call</h2>
              <button onClick={() => setShowBookCallModal(false)} className="text-neutral-500 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Doctors Available Now
                </div>
                <p className="text-neutral-700 dark:text-gray-300 text-sm">Average wait time: 8 minutes</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-neutral-700 dark:text-gray-300">
                  <Video className="w-5 h-5 text-primary" />
                  <span className="text-sm">Video consultation (recommended)</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-700 dark:text-gray-300">
                  <Phone className="w-5 h-5 text-primary" />
                  <span className="text-sm">Audio call option available</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-700 dark:text-gray-300">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-sm">15-20 minute consultation</span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-neutral-600 dark:text-gray-400">
                  <strong className="text-neutral-900 dark:text-white">Note:</strong> Have your health profile and symptoms ready. The doctor
                  may request additional information or tests during the consultation.
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-300 dark:border-sidebar-border space-y-3">
              <button className="w-full py-3 rounded-lg bg-primary text-white font-bold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                <Video className="w-5 h-5" />
                Start Video Call Now
              </button>
              <button
                onClick={() => setShowBookCallModal(false)}
                className="w-full py-2 text-neutral-500 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ========== DAILY PLAN SECTION ==========
function DailyPlanSection() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [planData, setPlanData] = useState({
    meals: {
      breakfast: { completed: false, items: [], calories: 0 },
      lunch: { completed: false, items: [], calories: 0 },
      dinner: { completed: false, items: [], calories: 0 },
      snacks: { completed: false, items: [], calories: 0 }
    },
    medicines: [],
    selfCare: [],
    waterIntake: { target: 8, completed: 0 },
    exercise: { target: 30, completed: 0 },
    progress: { overall: 0, meals: 0, medicines: 0, selfCare: 0 }
  });

  const [showAddMeal, setShowAddMeal] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('breakfast');

  useEffect(() => {
    const initializePlanData = () => {
      const today = new Date();
      const isToday = selectedDate.toDateString() === today.toDateString();
      const isFuture = selectedDate > today;
      const isPast = selectedDate < today;

      // Generate dynamic data based on selected date
      const generateDateBasedData = () => {
        if (isFuture) {
          // Future dates - planning mode (nothing completed)
          return {
            meals: {
              breakfast: {
                completed: false,
                items: [
                  { name: 'Planned oatmeal', calories: 250, protein: 8 },
                  { name: 'Green tea', calories: 0, antioxidants: true }
                ],
                calories: 250,
                target: 350
              },
              lunch: {
                completed: false,
                items: [
                  { name: 'Planned salmon dish', calories: 300, protein: 25 },
                  { name: 'Quinoa bowl', calories: 200, fiber: 8 }
                ],
                calories: 500,
                target: 600
              },
              dinner: {
                completed: false,
                items: [
                  { name: 'Planned dinner', calories: 400, protein: 25 }
                ],
                calories: 400,
                target: 500
              },
              snacks: {
                completed: false,
                items: [
                  { name: 'Planned healthy snack', calories: 150, protein: 10 }
                ],
                calories: 150,
                target: 200
              }
            },
            medicines: [
              { name: 'Vitamin D', time: '08:00', completed: false, type: 'supplement' },
              { name: 'Blood pressure med', time: '12:00', completed: false, type: 'prescription' },
              { name: 'Omega-3', time: '20:00', completed: false, type: 'supplement' }
            ],
            selfCare: [
              { name: '10 min meditation', completed: false, category: 'mental', icon: Brain },
              { name: 'Drink 8 glasses water', completed: false, category: 'hydration', icon: Droplets },
              { name: '30 min walk/exercise', completed: false, category: 'physical', icon: Dumbbell },
              { name: 'Take vitamins', completed: false, category: 'health', icon: Pill },
              { name: 'Check blood glucose', completed: false, category: 'monitoring', icon: Activity },
              { name: 'Practice gratitude journal', completed: false, category: 'mental', icon: Heart }
            ],
            waterIntake: { target: 8, completed: 0 },
            exercise: { target: 30, completed: 0 },
            progress: { overall: 0, meals: 0, medicines: 0, selfCare: 0 }
          };
        } else if (isPast) {
          // Past dates - completed mode (most things done)
          return {
            meals: {
              breakfast: {
                completed: true,
                items: [
                  { name: 'Oatmeal with berries', calories: 280, protein: 8 },
                  { name: 'Green tea', calories: 0, antioxidants: true }
                ],
                calories: 280,
                target: 350
              },
              lunch: {
                completed: true,
                items: [
                  { name: 'Grilled salmon', calories: 300, protein: 25 },
                  { name: 'Quinoa salad', calories: 200, fiber: 8 },
                  { name: 'Steamed broccoli', calories: 50, vitamins: ['C', 'K'] }
                ],
                calories: 550,
                target: 600
              },
              dinner: {
                completed: true,
                items: [
                  { name: 'Chicken breast', calories: 250, protein: 30 },
                  { name: 'Sweet potato', calories: 150, fiber: 4 },
                  { name: 'Mixed vegetables', calories: 80, vitamins: ['A', 'C'] }
                ],
                calories: 480,
                target: 500
              },
              snacks: {
                completed: true,
                items: [
                  { name: 'Greek yogurt', calories: 100, protein: 15 },
                  { name: 'Almonds (10 pieces)', calories: 70, healthy_fats: true }
                ],
                calories: 170,
                target: 200
              }
            },
            medicines: [
              { name: 'Vitamin D', time: '08:00', completed: true, type: 'supplement' },
              { name: 'Blood pressure med', time: '12:00', completed: true, type: 'prescription' },
              { name: 'Omega-3', time: '20:00', completed: true, type: 'supplement' }
            ],
            selfCare: [
              { name: '10 min meditation', completed: true, category: 'mental', icon: Brain },
              { name: 'Drink 8 glasses water', completed: true, category: 'hydration', icon: Droplets },
              { name: '30 min walk/exercise', completed: true, category: 'physical', icon: Dumbbell },
              { name: 'Take vitamins', completed: true, category: 'health', icon: Pill },
              { name: 'Check blood glucose', completed: true, category: 'monitoring', icon: Activity },
              { name: 'Practice gratitude journal', completed: true, category: 'mental', icon: Heart }
            ],
            waterIntake: { target: 8, completed: 8 },
            exercise: { target: 30, completed: 30 },
            progress: { overall: 92, meals: 100, medicines: 100, selfCare: 85 }
          };
        } else {
          // Today - partial progress (current realistic state)
          return {
            meals: {
              breakfast: {
                completed: true,
                items: [
                  { name: 'Oatmeal with berries', calories: 250, protein: 8 },
                  { name: 'Green tea', calories: 0, antioxidants: true }
                ],
                calories: 250,
                target: 350
              },
              lunch: {
                completed: false,
                items: [
                  { name: 'Grilled salmon', calories: 300, protein: 25 },
                  { name: 'Quinoa salad', calories: 200, fiber: 8 },
                  { name: 'Steamed broccoli', calories: 50, vitamins: ['C', 'K'] }
                ],
                calories: 550,
                target: 600
              },
              dinner: {
                completed: false,
                items: [
                  { name: 'Chicken breast', calories: 250, protein: 30 },
                  { name: 'Sweet potato', calories: 150, fiber: 4 },
                  { name: 'Mixed vegetables', calories: 80, vitamins: ['A', 'C'] }
                ],
                calories: 480,
                target: 500
              },
              snacks: {
                completed: true,
                items: [
                  { name: 'Greek yogurt', calories: 100, protein: 15 },
                  { name: 'Almonds (10 pieces)', calories: 70, healthy_fats: true }
                ],
                calories: 170,
                target: 200
              }
            },
            medicines: [
              { name: 'Vitamin D', time: '08:00', completed: true, type: 'supplement' },
              { name: 'Blood pressure med', time: '12:00', completed: false, type: 'prescription' },
              { name: 'Omega-3', time: '20:00', completed: false, type: 'supplement' }
            ],
            selfCare: [
              { name: '10 min meditation', completed: true, category: 'mental', icon: Brain },
              { name: 'Drink 8 glasses water', completed: false, category: 'hydration', icon: Droplets },
              { name: '30 min walk/exercise', completed: false, category: 'physical', icon: Dumbbell },
              { name: 'Take vitamins', completed: false, category: 'health', icon: Pill },
              { name: 'Check blood glucose', completed: false, category: 'monitoring', icon: Activity },
              { name: 'Practice gratitude journal', completed: false, category: 'mental', icon: Heart }
            ],
            waterIntake: { target: 8, completed: 3 },
            exercise: { target: 30, completed: 15 },
            progress: { overall: 35, meals: 25, medicines: 33, selfCare: 50 }
          };
        }
      };

      setPlanData(generateDateBasedData());
    };

    initializePlanData();
  }, [selectedDate]);

  const toggleMealComplete = (mealType) => {
    setPlanData(prev => {
      const updatedData = {
        ...prev,
        meals: {
          ...prev.meals,
          [mealType]: {
            ...prev.meals[mealType],
            completed: !prev.meals[mealType].completed
          }
        }
      };
      return calculateProgress(updatedData);
    });
  };

  const toggleMedicineComplete = (index) => {
    setPlanData(prev => {
      const newMedicines = [...prev.medicines];
      newMedicines[index].completed = !newMedicines[index].completed;
      const updatedData = { ...prev, medicines: newMedicines };
      return calculateProgress(updatedData);
    });
  };

  const toggleSelfCareTask = (index) => {
    setPlanData(prev => {
      const newSelfCare = [...prev.selfCare];
      newSelfCare[index].completed = !newSelfCare[index].completed;
      const updatedData = { ...prev, selfCare: newSelfCare };
      return calculateProgress(updatedData);
    });
  };

  const calculateProgress = (data) => {
    // Calculate meals progress
    const completedMeals = Object.values(data.meals).filter(meal => meal.completed).length;
    const totalMeals = Object.keys(data.meals).length;
    const mealsProgress = totalMeals > 0 ? Math.round((completedMeals / totalMeals) * 100) : 0;

    // Calculate medicines progress
    const completedMedicines = data.medicines.filter(medicine => medicine.completed).length;
    const medicinesProgress = data.medicines.length > 0 ? Math.round((completedMedicines / data.medicines.length) * 100) : 0;

    // Calculate self-care progress
    const completedSelfCare = data.selfCare.filter(task => task.completed).length;
    const selfCareProgress = data.selfCare.length > 0 ? Math.round((completedSelfCare / data.selfCare.length) * 100) : 0;

    // Calculate overall progress
    const overallProgress = Math.round((mealsProgress + medicinesProgress + selfCareProgress) / 3);

    return {
      ...data,
      progress: {
        overall: overallProgress,
        meals: mealsProgress,
        medicines: medicinesProgress,
        selfCare: selfCareProgress
      }
    };
  };

  const getMealIcon = (mealType) => {
    switch (mealType) {
      case 'breakfast': return Sun;
      case 'lunch': return Sunset;
      case 'dinner': return Moon;
      case 'snacks': return Apple;
      default: return UtensilsCrossed;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'mental': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'physical': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'hydration': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'health': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'monitoring': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-8">
            {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Wellness Plan</h2>
          <p className="text-gray-600 dark:text-muted text-sm mt-1">
            {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const newDate = new Date(selectedDate);
              newDate.setDate(newDate.getDate() - 1);
              setSelectedDate(newDate);
            }}
            className="p-2 rounded-lg bg-gray-100 dark:bg-sidebar-hover hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setSelectedDate(new Date())}
            className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-blue-600 transition-colors text-sm font-medium"
          >
            Today
          </button>
          <button
            onClick={() => {
              const newDate = new Date(selectedDate);
              newDate.setDate(newDate.getDate() + 1);
              setSelectedDate(newDate);
            }}
            className="p-2 rounded-lg bg-gray-100 dark:bg-sidebar-hover hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-card-dark rounded-xl border border-neutral-200 dark:border-sidebar-border p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">Overall Progress</h3>
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{planData.progress.overall}%</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">complete</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${planData.progress.overall}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white dark:bg-card-dark rounded-xl border border-neutral-200 dark:border-sidebar-border p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">Meals</h3>
            <UtensilsCrossed className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{planData.progress.meals}%</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">complete</span>
          </div>
        </div>

        <div className="bg-white dark:bg-card-dark rounded-xl border border-neutral-200 dark:border-sidebar-border p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">Medicines</h3>
            <Pill className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{planData.progress.medicines}%</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">complete</span>
          </div>
        </div>

        <div className="bg-white dark:bg-card-dark rounded-xl border border-neutral-200 dark:border-sidebar-border p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">Self Care</h3>
            <Heart className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{planData.progress.selfCare}%</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">complete</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Meals Section */}
        <div className="space-y-6">
                    <div className="flex items-center justify-between">
            <h3 className="font-bold text-xl text-gray-900 dark:text-white">Daily Meals</h3>
            <button
              onClick={() => setShowAddMeal(true)}
              className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Food
            </button>
          </div>

          {Object.entries(planData.meals).map(([mealType, meal]) => {
            const MealIcon = getMealIcon(mealType);
            return (
              <div key={mealType} className="bg-white dark:bg-card-dark rounded-xl border border-neutral-200 dark:border-sidebar-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${meal.completed ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-800'}`}>
                      <MealIcon className={`w-5 h-5 ${meal.completed ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`} />
                    </div>
                        <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white capitalize">{mealType}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {meal.calories}/{meal.target} calories
                      </p>
                        </div>
                  </div>
                  <button
                    onClick={() => toggleMealComplete(mealType)}
                    className={`p-2 rounded-lg transition-colors ${meal.completed
                      ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                      : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                  >
                    <Check className="w-4 h-4" />
                  </button>
                    </div>

                <div className="space-y-2">
                  {meal.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="text-sm text-gray-900 dark:text-white">{item.name}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{item.calories} cal</span>
                </div>
                  ))}
            </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {Math.round((meal.calories / meal.target) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((meal.calories / meal.target) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Medicines & Self Care */}
        <div className="space-y-6">
          {/* Medicine Schedule */}
          <div className="bg-white dark:bg-card-dark rounded-xl border border-neutral-200 dark:border-sidebar-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Medicine Schedule</h3>
              <Pill className="w-5 h-5 text-blue-600" />
            </div>

            <div className="space-y-3">
              {planData.medicines.map((medicine, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleMedicineComplete(index)}
                      className={`p-1.5 rounded-full transition-colors ${medicine.completed
                        ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                        : 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                    >
                      <Check className="w-3 h-3" />
                    </button>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{medicine.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{medicine.time} • {medicine.type}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${medicine.completed
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                    {medicine.completed ? 'Taken' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Self Care Tasks */}
          <div className="bg-white dark:bg-card-dark rounded-xl border border-neutral-200 dark:border-sidebar-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Self Care Tasks</h3>
              <button
                onClick={() => setShowAddTask(true)}
                className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Task
              </button>
            </div>

            <div className="space-y-3">
              {planData.selfCare.map((task, index) => {
                const TaskIcon = task.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleSelfCareTask(index)}
                        className={`p-1.5 rounded-full transition-colors ${task.completed
                          ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                          : 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 hover:bg-gray-300 dark:hover:bg-gray-600'
                          }`}
                      >
                        <Check className="w-3 h-3" />
                      </button>
                      <TaskIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{task.name}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`}>
                      {task.category}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-card-dark rounded-xl border border-neutral-200 dark:border-sidebar-border p-4">
              <div className="flex items-center gap-3 mb-3">
                <Droplets className="w-5 h-5 text-blue-500" />
                <span className="font-semibold text-gray-900 dark:text-white">Water</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {planData.waterIntake.completed}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  / {planData.waterIntake.target} glasses
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-card-dark rounded-xl border border-neutral-200 dark:border-sidebar-border p-4">
              <div className="flex items-center gap-3 mb-3">
                <Dumbbell className="w-5 h-5 text-green-500" />
                <span className="font-semibold text-gray-900 dark:text-white">Exercise</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {planData.exercise.completed}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  / {planData.exercise.target} min
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Meal Modal */}
      {showAddMeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-card-dark rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Food Item</h3>
              <button
                onClick={() => setShowAddMeal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const foodName = formData.get('foodName');
              const calories = formData.get('calories');
              const mealType = formData.get('mealType');

              if (foodName && calories && mealType) {
                setPlanData(prev => {
                  const updatedData = {
                    ...prev,
                    meals: {
                      ...prev.meals,
                      [mealType]: {
                        ...prev.meals[mealType],
                        items: [...prev.meals[mealType].items, { name: foodName, calories: parseInt(calories) }],
                        calories: prev.meals[mealType].calories + parseInt(calories)
                      }
                    }
                  };
                  return calculateProgress(updatedData);
                });
                setShowAddMeal(false);
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Food Name
                  </label>
                        <input
                            type="text"
                    name="foodName"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g., Grilled chicken breast"
                        />
                    </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Calories
                  </label>
                  <input
                    type="number"
                    name="calories"
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g., 150"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Meal Type
                  </label>
                  <select
                    name="mealType"
                    required
                    defaultValue={selectedMealType}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snacks">Snacks</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddMeal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Add Food
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-card-dark rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Self-Care Task</h3>
              <button
                onClick={() => setShowAddTask(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const taskName = formData.get('taskName');
              const category = formData.get('category');

              if (taskName && category) {
                const iconMap = {
                  mental: Brain,
                  physical: Dumbbell,
                  hydration: Droplets,
                  health: Pill,
                  monitoring: Activity
                };

                setPlanData(prev => {
                  const updatedData = {
                    ...prev,
                    selfCare: [...prev.selfCare, {
                      name: taskName,
                      completed: false,
                      category: category,
                      icon: iconMap[category] || Heart
                    }]
                  };
                  return calculateProgress(updatedData);
                });
                setShowAddTask(false);
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Task Name
                  </label>
                  <input
                    type="text"
                    name="taskName"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g., 15 min stretching"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="mental">Mental Health</option>
                    <option value="physical">Physical Activity</option>
                    <option value="hydration">Hydration</option>
                    <option value="health">Health Monitoring</option>
                    <option value="monitoring">General Monitoring</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
                  className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ========== REMINDERS SECTION ==========
function RemindersSection({ navigate }) {
  const [selectedLabel, setSelectedLabel] = useState('Today');
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
    updateLabel(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
    updateLabel(newDate);
  };

  const updateLabel = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    const diffTime = compareDate - today;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) setSelectedLabel('Today');
    else if (diffDays === 1) setSelectedLabel('Tomorrow');
    else if (diffDays === -1) setSelectedLabel('Yesterday');
    else if (diffDays > 0) setSelectedLabel(`+${diffDays} days`);
    else setSelectedLabel(`${diffDays} days`);
  };

  const handleAddMedication = () => {
    // Navigate to pharmacy section to add medication
    navigate('/dashboard?section=pharmacy');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-10">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Today's Schedule</h2>
            <p className="text-gray-600 dark:text-muted text-sm mt-1">{currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-card-dark p-1 rounded-lg border border-gray-300 dark:border-sidebar-border shadow-sm">
            <button
              onClick={handlePrevDay}
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-neutral-100 dark:hover:bg-sidebar-hover text-neutral-500 dark:text-gray-400 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold px-2 text-gray-900 dark:text-white min-w-[80px] text-center">{selectedLabel}</span>
            <button
              onClick={handleNextDay}
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-neutral-100 dark:hover:bg-sidebar-hover text-neutral-500 dark:text-gray-400 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </header>

        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Pill className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-gray-900 dark:text-white text-xl font-bold mb-2">No Medications Scheduled</h3>
          <p className="text-gray-600 dark:text-muted text-sm max-w-md leading-relaxed">
            Add your medications to start tracking your daily schedule and medication adherence.
          </p>
          <button
            onClick={handleAddMedication}
            className="mt-6 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl active:scale-95 transform"
          >
            Add Medication
          </button>
        </div>
      </div>
      <div className="space-y-6">
        <div className="bg-white dark:bg-card-dark rounded-xl border border-neutral-200 dark:border-sidebar-border shadow-sm p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-2">Adherence Score</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-6">Weekly medication tracking</p>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-sidebar-hover flex items-center justify-center mb-4">
              <Pill className="w-10 h-10 text-gray-400 dark:text-muted" />
            </div>
            <p className="text-gray-900 dark:text-white text-sm font-semibold">No Data Yet</p>
            <p className="text-gray-600 dark:text-gray-400 text-xs text-center mt-2 max-w-[200px]">
              Start tracking your medications to see your adherence score
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-card-dark rounded-xl border border-neutral-200 dark:border-sidebar-border shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white">Upcoming Refills</h3>
          </div>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-sidebar-hover flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-gray-400 dark:text-muted" />
            </div>
            <p className="text-gray-900 dark:text-white text-sm font-semibold">No Refills Needed</p>
            <p className="text-gray-600 dark:text-gray-400 text-xs text-center mt-2 max-w-[200px]">
              Your refill information will appear here
            </p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-primary to-blue-600 rounded-xl shadow-md p-6 text-white relative overflow-hidden">
          <MessageCircle className="absolute -bottom-4 -right-4 w-24 h-24 opacity-10 rotate-12" />
          <h3 className="font-bold text-lg mb-2 relative z-10">Need Assistance?</h3>
          <p className="text-blue-100 text-sm mb-4 relative z-10">
            Our AI assistant can help you reschedule doses or answer medication questions.
          </p>
          <Link
            to="/dashboard?section=consultations"
            className="relative z-10 inline-flex bg-white text-primary text-sm font-bold py-2 px-4 rounded-lg shadow-sm hover:bg-blue-50 transition-colors"
          >
            Chat with MediAI
          </Link>
        </div>
      </div>
    </div>
  );
}

// ========== FOOD ADVISOR SECTION ==========
function FoodAdvisorSection() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [waterIntake, setWaterIntake] = useState(0);
  const goal = 2.5;
  const percentage = Math.min((waterIntake / goal) * 100, 100);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      alert(`Searching for "${query}"...\n\nThis feature will check:\n• Safety for your health conditions\n• Nutritional information\n• Allergen warnings\n• Interaction with medications`);
      setIsSearching(false);
    }, 500);
  };

  const handleVoiceSearch = () => {
    alert('Voice search coming soon!\n\nThis will allow you to:\n• Speak food names\n• Get instant results\n• Hands-free operation');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleGenerateMealPlan = () => {
    alert('AI Meal Plan Generator coming soon!\n\nPersonalized plans based on:\n• Your health conditions\n• Dietary preferences\n• Caloric needs\n• Nutritional goals\n• Medication interactions');
  };

  const handleLogWater = () => {
    const amount = prompt('How much water did you drink? (in Liters)\n\nExamples: 0.25, 0.5, 1.0');
    if (amount && !isNaN(amount)) {
      const newTotal = Math.min(waterIntake + parseFloat(amount), goal);
      setWaterIntake(newTotal);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-8 flex flex-col gap-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-blue-600 to-indigo-700 p-8 text-white shadow-lg">
          <div className="relative z-10 flex flex-col gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">Welcome to Food Advisor</h2>
              <p className="text-blue-100 text-lg max-w-xl">
                Get personalized dietary recommendations based on your health profile.
              </p>
            </div>
          </div>
          <UtensilsCrossed className="absolute -right-6 -bottom-10 w-[200px] h-[200px] text-white/5 rotate-12" />
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">Check Food Safety</h3>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400 dark:text-gray-400 group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isSearching}
              className="block w-full pl-12 pr-12 py-4 bg-white dark:bg-card-dark border-0 ring-1 ring-gray-300 dark:ring-sidebar-border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary shadow-sm text-lg transition-shadow focus:outline-none disabled:opacity-50"
              placeholder="Search for food (e.g., 'Banana', 'Canned Soup')..."
            />
            <button
              onClick={handleVoiceSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-neutral-100 dark:bg-sidebar-hover hover:bg-neutral-200 dark:hover:bg-sidebar-border text-neutral-500 dark:text-gray-400 p-2 rounded-lg transition-colors"
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recommended for You</h3>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-sidebar-hover px-2 py-1 rounded-full">Safe to Eat</span>
          </div>
          <div className="flex flex-col items-center justify-center py-12 border border-dashed border-neutral-300 dark:border-sidebar-border rounded-xl">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-gray-900 dark:text-white text-sm font-semibold">No Recommendations Yet</p>
            <p className="text-gray-600 dark:text-gray-400 text-xs text-center mt-2 max-w-[300px]">
              Search for foods or update your health profile to get personalized recommendations
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Foods to Limit or Avoid</h3>
          </div>
          <div className="flex flex-col items-center justify-center py-12 border border-dashed border-neutral-300 dark:border-sidebar-border rounded-xl">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
              <Info className="w-8 h-8 text-amber-500" />
            </div>
            <p className="text-gray-900 dark:text-white text-sm font-semibold">No Restrictions</p>
            <p className="text-gray-600 dark:text-gray-400 text-xs text-center mt-2 max-w-[300px]">
              Based on your health profile, we'll show foods to limit or avoid
            </p>
          </div>
        </div>
      </div>
      <div className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
        <div className="bg-white dark:bg-card-dark rounded-2xl border border-gray-300 dark:border-sidebar-border shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-300 dark:border-sidebar-border flex items-center justify-between">
            <h3 className="font-bold text-gray-900 dark:text-white">Daily Meal Plan</h3>
            <button
              onClick={handleGenerateMealPlan}
              className="flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded hover:bg-primary/20 transition-colors active:scale-95 transform"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              AI Generate
            </button>
          </div>
          <div className="p-8 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-sidebar-hover flex items-center justify-center mb-4">
              <UtensilsCrossed className="w-8 h-8 text-gray-400 dark:text-muted" />
            </div>
            <p className="text-gray-900 dark:text-white text-sm font-semibold">No Meal Plan</p>
            <p className="text-gray-600 dark:text-gray-400 text-xs text-center mt-2 max-w-[200px] mb-4">
              Generate a personalized meal plan based on your health goals
            </p>
            <button
              onClick={handleGenerateMealPlan}
              className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl active:scale-95 transform"
            >
              Generate Plan
            </button>
          </div>
        </div>
        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Droplets className="w-5 h-5" />
              <h4 className="font-bold text-lg">Hydration Goal</h4>
            </div>
            <p className="text-blue-100 text-sm mb-4">Track your daily water intake for better health.</p>
            <div className="flex items-end gap-1 mb-2">
              <span className="text-3xl font-bold">{waterIntake.toFixed(1)}</span>
              <span className="text-sm font-medium opacity-80 mb-1">/ {goal} Liters</span>
            </div>
            <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
              <div
                className="bg-white h-full rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <button
              onClick={handleLogWater}
              className="mt-4 w-full py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white text-sm font-semibold transition-colors active:scale-95 transform"
            >
              Log Water Intake
            </button>
          </div>
          <Droplets className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10" />
        </div>
      </div>
    </div>
  );
}

// Health Profile Section Component
function HealthProfileSection() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6 items-start lg:items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-gray-900 dark:text-white">
            My Health Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base mt-2">
            Manage your personal health information and medical history.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h3>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <div>Age: 28 years</div>
            <div>Height: 5'8" (173 cm)</div>
            <div>Weight: 70 kg</div>
            <div>Blood Type: O+</div>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Health Metrics</h3>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <div>BMI: 23.4 (Normal)</div>
            <div>Blood Pressure: 120/80</div>
            <div>Heart Rate: 72 bpm</div>
            <div>Last Checkup: 2 weeks ago</div>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Medical Conditions</h3>
          <div className="space-y-2">
            <div className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-full text-xs">
              Seasonal Allergies
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-500">No other conditions</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// History Section Component
function HistorySection() {
  const historyData = [
    { date: '2026-02-08', type: 'Consultation', doctor: 'Dr. Sarah Wilson', status: 'Completed' },
    { date: '2026-02-05', type: 'Prescription', medication: 'Vitamin D3', status: 'Filled' },
    { date: '2026-01-28', type: 'Lab Test', test: 'Blood Panel', status: 'Results Available' },
    { date: '2026-01-22', type: 'Consultation', doctor: 'Dr. Michael Chen', status: 'Completed' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6 items-start lg:items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-gray-900 dark:text-white">
            Medical History
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base mt-2">
            View your complete medical history and past interactions.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {historyData.map((item, index) => (
            <div key={index} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                                            <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="font-medium text-gray-900 dark:text-white">{item.type}</span>
                                                </div>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {item.doctor && `Dr. ${item.doctor}`}
                    {item.medication && `Medication: ${item.medication}`}
                    {item.test && `Test: ${item.test}`}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-900 dark:text-white">{item.date}</div>
                  <div className="text-xs text-green-600 dark:text-green-400">{item.status}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Settings Section Component  
function SettingsSection() {
  const [notifications, setNotifications] = useState({
    reminders: true,
    appointments: true,
    results: false,
  });

  const [privacy, setPrivacy] = useState({
    dataSharing: false,
    analytics: true,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6 items-start lg:items-center justify-between">
                                                <div>
          <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base mt-2">
            Customize your MediAI experience and preferences.
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Notifications Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Medication Reminders</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Get notified when it's time to take your medications</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notifications.reminders}
                  onChange={(e) => setNotifications(prev => ({ ...prev, reminders: e.target.checked }))}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Appointment Reminders</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Receive alerts about upcoming appointments</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notifications.appointments}
                  onChange={(e) => setNotifications(prev => ({ ...prev, appointments: e.target.checked }))}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Test Results</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Get notified when test results are available</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notifications.results}
                  onChange={(e) => setNotifications(prev => ({ ...prev, results: e.target.checked }))}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Privacy & Data</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Data Sharing</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Allow anonymous data sharing for research</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={privacy.dataSharing}
                  onChange={(e) => setPrivacy(prev => ({ ...prev, dataSharing: e.target.checked }))}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Usage Analytics</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Help improve the app with usage data</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={privacy.analytics}
                  onChange={(e) => setPrivacy(prev => ({ ...prev, analytics: e.target.checked }))}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mock medicine database
const MOCK_MEDICINES = [
  {
    id: 1,
    name: 'Aspirin',
    genericName: 'Acetylsalicylic Acid',
    brand: 'Bayer',
    price: 746,
    originalPrice: 1078,
    type: 'OTC',
    category: 'Pain Relief',
    dosage: '81mg',
    quantity: 100,
    rating: 4.5,
    reviews: 128,
    inStock: true,
    prescription: false,
    image: '/api/placeholder/100/100',
    description: 'Low-dose aspirin for heart health and pain relief.',
    activeIngredient: 'Acetylsalicylic Acid 81mg',
    uses: ['Heart protection', 'Pain relief', 'Blood thinner'],
    warnings: ['Do not exceed recommended dose', 'Consult doctor if pregnant'],
  },
  {
    id: 2,
    name: 'Lisinopril',
    genericName: 'Lisinopril',
    brand: 'Prinivil',
    price: 2074,
    originalPrice: 2489,
    type: 'Prescription',
    category: 'Blood Pressure',
    dosage: '10mg',
    quantity: 90,
    rating: 4.2,
    reviews: 89,
    inStock: true,
    prescription: true,
    image: '/api/placeholder/100/100',
    description: 'ACE inhibitor for treating high blood pressure.',
    activeIngredient: 'Lisinopril 10mg',
    uses: ['High blood pressure', 'Heart failure', 'Kidney protection'],
    warnings: ['Prescription required', 'Regular monitoring needed'],
  },
  {
    id: 3,
    name: 'Vitamin D3',
    genericName: 'Cholecalciferol',
    brand: 'Nature Made',
    price: 1410,
    originalPrice: 1659,
    type: 'OTC',
    category: 'Vitamins',
    dosage: '2000 IU',
    quantity: 120,
    rating: 4.7,
    reviews: 245,
    inStock: true,
    prescription: false,
    image: '/api/placeholder/100/100',
    description: 'Essential vitamin for bone health and immune function.',
    activeIngredient: 'Cholecalciferol 2000 IU',
    uses: ['Bone health', 'Immune support', 'Vitamin D deficiency'],
    warnings: ['Do not exceed recommended dose'],
  },
  {
    id: 4,
    name: 'Metformin',
    genericName: 'Metformin HCl',
    brand: 'Glucophage',
    price: 1867,
    originalPrice: 2406,
    type: 'Prescription',
    category: 'Diabetes',
    dosage: '500mg',
    quantity: 60,
    rating: 4.1,
    reviews: 156,
    inStock: true,
    prescription: true,
    image: '/api/placeholder/100/100',
    description: 'First-line medication for type 2 diabetes management.',
    activeIngredient: 'Metformin HCl 500mg',
    uses: ['Type 2 diabetes', 'Blood sugar control', 'PCOS'],
    warnings: ['Prescription required', 'Take with meals'],
  },
  {
    id: 5,
    name: 'Omega-3',
    genericName: 'Fish Oil',
    brand: 'Nordic Naturals',
    price: 1659,
    originalPrice: 2074,
    type: 'OTC',
    category: 'Supplements',
    dosage: '1000mg',
    quantity: 60,
    rating: 4.4,
    reviews: 89,
    inStock: true,
    prescription: false,
    image: '/api/placeholder/100/100',
    description: 'Essential fatty acids for heart and brain health.',
    activeIngredient: 'EPA 360mg, DHA 240mg',
    uses: ['Heart health', 'Brain function', 'Joint health'],
    warnings: ['Consult doctor if taking blood thinners'],
  }
];

const CATEGORIES = [
  'All',
  'Pain Relief',
  'Blood Pressure',
  'Diabetes',
  'Vitamins',
  'Supplements',
  'Antibiotics',
  'Heart Health'
];

function MedicineCard({ medicine, onAddToCart, cartQuantity, onAutoRefill, autoRefillEnabled, insuranceCoverage }) {
  return (
    <div className="bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-sidebar-border hover:border-primary/50 transition-all duration-200 overflow-hidden shadow-sm hover:shadow-lg">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-900 dark:text-white text-base">{medicine.name}</h3>
              {medicine.prescription && (
                <span className="px-2 py-1 bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-medium rounded border border-red-500/20">
                  Rx
                </span>
              )}
              {autoRefillEnabled && (
                <span className="px-2 py-1 bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium rounded border border-green-500/20">
                  Auto-Refill
                </span>
              )}
              {!medicine.inStock && (
                <span className="px-2 py-1 bg-gray-500/10 text-gray-600 dark:text-gray-400 text-xs font-medium rounded border border-gray-500/20">
                  Out of Stock
                </span>
                                                    )}
                                                </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{medicine.genericName}</p>
            <p className="text-gray-500 dark:text-gray-500 text-xs">{medicine.brand} • {medicine.dosage}</p>
                                            </div>
          <button
            onClick={() => onAutoRefill(medicine)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors"
            title="Auto-Refill Settings"
          >
            <Repeat className="w-4 h-4" />
          </button>
                                        </div>

        {/* Description */}
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 line-clamp-2">{medicine.description}</p>

        {/* Insurance Coverage */}
        {insuranceCoverage && (
          <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center justify-between text-xs">
              <span className="text-blue-700 dark:text-blue-300">Insurance covers {Math.round(insuranceCoverage.coveragePercentage * 100)}%</span>
              <span className="font-semibold text-blue-900 dark:text-blue-400">Your copay: ₹{insuranceCoverage.copay.toFixed(0)}</span>
                                        </div>
                                    </div>
        )}

        {/* Rating & Reviews */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i < Math.floor(medicine.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`}
              />
            ))}
          </div>
          <span className="text-gray-900 dark:text-white font-medium text-sm">{medicine.rating}</span>
          <span className="text-gray-500 dark:text-gray-400 text-xs">({medicine.reviews} reviews)</span>
        </div>

        {/* Price & Actions */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-primary font-bold text-lg">
                ₹{insuranceCoverage ? insuranceCoverage.copay.toFixed(0) : medicine.price.toFixed(0)}
              </span>
              {insuranceCoverage && (
                <span className="text-gray-400 dark:text-gray-500 text-sm line-through">₹{medicine.price.toFixed(0)}</span>
              )}
              {!insuranceCoverage && medicine.originalPrice > medicine.price && (
                <span className="text-gray-400 dark:text-gray-500 text-sm line-through">₹{medicine.originalPrice}</span>
              )}
            </div>
            {insuranceCoverage && (
              <span className="text-xs text-green-600 dark:text-green-400">Saved ₹{(medicine.price - insuranceCoverage.copay).toFixed(0)}</span>
            )}
          </div>

          {cartQuantity > 0 ? (
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-background-dark rounded-lg p-1">
              <button
                onClick={() => onAddToCart(medicine, -1)}
                className="w-6 h-6 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-sidebar-hover rounded transition-colors"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-gray-900 dark:text-white font-medium px-2 text-sm">{cartQuantity}</span>
              <button
                onClick={() => onAddToCart(medicine, 1)}
                className="w-6 h-6 flex items-center justify-center text-primary hover:bg-primary/10 rounded transition-colors"
                disabled={!medicine.inStock}
              >
                <Plus className="w-3 h-3" />
              </button>
                    </div>
                ) : (
            <button
              onClick={() => onAddToCart(medicine, 1)}
              disabled={!medicine.inStock}
              className="px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 text-sm font-semibold"
            >
              <Plus className="w-3 h-3" />
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function CartModal({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onCheckout }) {
  if (!isOpen) return null;

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const prescriptionItems = cartItems.filter(item => item.prescription);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-card-dark rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-sidebar-border">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-sidebar-hover rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
                        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Your cart is empty</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Add medicines to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-background-dark rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">{item.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.dosage}</p>
                    <p className="text-sm font-medium text-primary">₹{item.price.toFixed(0)} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-sidebar-hover rounded transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center font-medium text-gray-900 dark:text-white">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center text-primary hover:bg-primary/10 rounded transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="ml-2 p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}

              {prescriptionItems.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 dark:text-blue-400 text-sm">Prescription Required</h4>
                      <p className="text-blue-700 dark:text-blue-300 text-xs mt-1">
                        You have {prescriptionItems.length} prescription item(s) in your cart.
                        You'll need to upload a valid prescription during checkout.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t border-gray-200 dark:border-sidebar-border pt-4 mt-6">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={onCheckout}
                className="w-full mt-4 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
            </div>
        </div>
    );
}

function OrderSuccessModal({ isOpen, onClose, order }) {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-card-dark rounded-xl shadow-xl max-w-md w-full">
        <div className="p-8 text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Order Confirmed!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your medicines will be delivered within 2-4 hours.
          </p>

          <div className="space-y-3 text-left bg-gray-50 dark:bg-background-dark rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Order ID:</span>
              <span className="font-mono text-gray-900 dark:text-white">#{order.orderId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total:</span>
              <span className="font-bold text-primary">${order.total.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Delivery:</span>
              <span className="text-gray-900 dark:text-white">2-4 hours</span>
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg mb-6">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div className="text-left">
                <p className="text-blue-900 dark:text-blue-400 font-medium text-sm">Tracking Available</p>
                <p className="text-blue-700 dark:text-blue-300 text-xs">
                  You'll receive SMS/Email updates on delivery status
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

function AutoRefillModal({ isOpen, onClose, medicine, onSaveSettings }) {
  const [refillSettings, setRefillSettings] = useState({
    enabled: false,
    frequency: '30', // days
    autoOrder: true,
    notifyBefore: '7', // days before
    quantity: medicine?.quantity || 30
  });

  const handleSave = () => {
    onSaveSettings(medicine.id, refillSettings);
    onClose();
  };

  if (!isOpen || !medicine) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-card-dark rounded-xl shadow-xl max-w-lg w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-sidebar-border">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Auto-Refill Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-sidebar-hover rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="w-12 h-12 rounded bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
              <Pill className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{medicine.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{medicine.dosage} • {medicine.brand}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-900 dark:text-white">
                Enable Auto-Refill
              </label>
              <button
                onClick={() => setRefillSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${refillSettings.enabled ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${refillSettings.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>

            {refillSettings.enabled && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Refill Frequency
                  </label>
                  <select
                    value={refillSettings.frequency}
                    onChange={(e) => setRefillSettings(prev => ({ ...prev, frequency: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-sidebar-border rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    <option value="30">Every 30 days</option>
                    <option value="60">Every 60 days</option>
                    <option value="90">Every 90 days</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Notify me {refillSettings.notifyBefore} days before refill
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="14"
                    value={refillSettings.notifyBefore}
                    onChange={(e) => setRefillSettings(prev => ({ ...prev, notifyBefore: e.target.value }))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>3 days</span>
                    <span>14 days</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-900 dark:text-white">
                    Auto-order when low
                  </label>
                  <button
                    onClick={() => setRefillSettings(prev => ({ ...prev, autoOrder: !prev.autoOrder }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${refillSettings.autoOrder ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${refillSettings.autoOrder ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 dark:border-sidebar-border text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-sidebar-hover transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2 px-4 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InsuranceModal({ isOpen, onClose, onSaveInsurance }) {
  const [insuranceData, setInsuranceData] = useState({
    provider: '',
    memberID: '',
    groupNumber: '',
    rxBIN: '',
    rxPCN: '',
    frontCard: null,
    backCard: null
  });
  const [isUploading, setIsUploading] = useState(false);
  const [step, setStep] = useState(1); // 1: Upload, 2: Verify, 3: Success

  const handleFileUpload = (side, file) => {
    setInsuranceData(prev => ({ ...prev, [side]: file }));
  };

  const handleVerification = async () => {
    setIsUploading(true);
    // Simulate verification process
    setTimeout(() => {
      setIsUploading(false);
      setStep(3);
    }, 2000);
  };

  const handleSave = () => {
    onSaveInsurance(insuranceData);
    onClose();
    setStep(1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-card-dark rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-sidebar-border">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Insurance Information</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-sidebar-hover rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-6">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                1
              </div>
              <span className="text-sm font-medium">Upload Card</span>
            </div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                2
              </div>
              <span className="text-sm font-medium">Verify</span>
            </div>
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-primary' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                3
              </div>
              <span className="text-sm font-medium">Complete</span>
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900 dark:text-white">Front of Card</label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                    {insuranceData.frontCard ? (
                      <div className="space-y-2">
                        <CheckCircle className="mx-auto h-8 w-8 text-green-500" />
                        <p className="text-sm text-green-600 dark:text-green-400">Front uploaded</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Camera className="mx-auto h-8 w-8 text-gray-400" />
                        <label className="cursor-pointer">
                          <span className="text-primary font-medium text-sm">Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload('frontCard', e.target.files[0])}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900 dark:text-white">Back of Card</label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                    {insuranceData.backCard ? (
                      <div className="space-y-2">
                        <CheckCircle className="mx-auto h-8 w-8 text-green-500" />
                        <p className="text-sm text-green-600 dark:text-green-400">Back uploaded</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Camera className="mx-auto h-8 w-8 text-gray-400" />
                        <label className="cursor-pointer">
                          <span className="text-primary font-medium text-sm">Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload('backCard', e.target.files[0])}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Insurance Provider"
                  value={insuranceData.provider}
                  onChange={(e) => setInsuranceData(prev => ({ ...prev, provider: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-sidebar-border rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Member ID"
                  value={insuranceData.memberID}
                  onChange={(e) => setInsuranceData(prev => ({ ...prev, memberID: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-sidebar-border rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Group Number"
                  value={insuranceData.groupNumber}
                  onChange={(e) => setInsuranceData(prev => ({ ...prev, groupNumber: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-sidebar-border rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!insuranceData.provider || !insuranceData.memberID}
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Verification
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Verify Insurance</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We're verifying your insurance information with {insuranceData.provider}
                </p>
              </div>

              {isUploading ? (
                <div className="space-y-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Verifying coverage...</p>
                </div>
              ) : (
                <button
                  onClick={handleVerification}
                  className="w-full py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Verify Insurance
                </button>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 text-center">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Insurance Verified!</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your {insuranceData.provider} insurance has been successfully verified.
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <div className="text-left">
                    <p className="text-green-900 dark:text-green-400 font-medium text-sm">Coverage Active</p>
                    <p className="text-green-700 dark:text-green-300 text-xs">
                      Prescription benefits available
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSave}
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Complete Setup
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PharmacySection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [showAutoRefill, setShowAutoRefill] = useState(false);
  const [showInsurance, setShowInsurance] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [autoRefillSettings, setAutoRefillSettings] = useState({});
  const [insuranceInfo, setInsuranceInfo] = useState(null);

  // Filter and sort medicines
  const filteredMedicines = MOCK_MEDICINES
    .filter(medicine => {
      const matchesSearch = medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        medicine.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        medicine.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || medicine.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        case 'popularity':
          return b.reviews - a.reviews;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const handleAddToCart = (medicine, quantity) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === medicine.id);
      if (existing) {
        const newQuantity = existing.quantity + quantity;
        if (newQuantity <= 0) {
          return prev.filter(item => item.id !== medicine.id);
        }
        return prev.map(item =>
          item.id === medicine.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else if (quantity > 0) {
        return [...prev, { ...medicine, quantity }];
      }
      return prev;
    });
  };

  const getCartQuantity = (medicineId) => {
    const item = cartItems.find(item => item.id === medicineId);
    return item ? item.quantity : 0;
  };

  const handleUpdateCartQuantity = (medicineId, newQuantity) => {
    if (newQuantity <= 0) {
      setCartItems(prev => prev.filter(item => item.id !== medicineId));
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === medicineId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const handleRemoveFromCart = (medicineId) => {
    setCartItems(prev => prev.filter(item => item.id !== medicineId));
  };

  const handleCheckout = () => {
    // Mock order processing
    const orderId = Date.now().toString();
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const order = {
      orderId,
      items: cartItems,
      total,
      estimatedDelivery: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
      status: 'confirmed'
    };

    setCompletedOrder(order);
    setShowOrderSuccess(true);
    setCartItems([]);
    setShowCart(false);
  };

  const handleAutoRefillSettings = (medicineId, settings) => {
    setAutoRefillSettings(prev => ({
      ...prev,
      [medicineId]: settings
    }));
  };

  const handleInsuranceInfo = (info) => {
    setInsuranceInfo(info);
  };

  const openAutoRefill = (medicine) => {
    setSelectedMedicine(medicine);
    setShowAutoRefill(true);
  };

  const getInsuranceCoverage = (medicine) => {
    if (!insuranceInfo) return null;
    // Mock insurance coverage calculation
    const coveragePercentage = medicine.prescription ? 0.8 : 0.5; // 80% for prescriptions, 50% for OTC
    const coveredAmount = medicine.price * coveragePercentage;
    const copay = medicine.price - coveredAmount;
    return { coveragePercentage, coveredAmount, copay };
  };

  // Calculate cart count
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6 items-start lg:items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-gray-900 dark:text-white">
            MediAI Pharmacy
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base mt-2">
            Order prescription medications and health products with same-day delivery.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {!insuranceInfo && (
            <button
              onClick={() => setShowInsurance(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg"
            >
              <Shield className="w-4 h-4" />
              <span className="font-medium text-sm">Add Insurance</span>
            </button>
          )}
          <button
            onClick={() => setShowCart(true)}
            className="relative flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-lg"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="font-medium">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Insurance Status */}
      {insuranceInfo && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-400">Insurance Active</h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {insuranceInfo.provider} • Member ID: {insuranceInfo.memberID}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowInsurance(true)}
              className="text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100 text-sm font-medium"
            >
              Update
            </button>
          </div>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-blue-600 to-indigo-700 p-6 lg:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col gap-4">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-2">Same-Day Delivery Available</h2>
            <p className="text-blue-100 text-base max-w-xl">
              Order by 2 PM for delivery today. FREE shipping for orders over ₹2,900.
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              <span>2-4 hour delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Repeat className="w-5 h-5" />
              <span>Auto-refill available</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span>Insurance accepted</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              <span>Secure packaging</span>
            </div>
          </div>
        </div>
        <ShoppingCart className="absolute -right-6 -bottom-10 w-[150px] h-[150px] text-white/5 rotate-12" />
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-sidebar-border p-4 lg:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-sidebar-border rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
              placeholder="Search medicines, supplements, vitamins..."
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-3 bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-sidebar-border rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
            >
              {CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-3 bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-sidebar-border rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="rating">Sort by Rating</option>
            <option value="popularity">Sort by Popularity</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {searchQuery ? `Search Results for "${searchQuery}"` : selectedCategory === 'All' ? 'All Medicines' : selectedCategory}
          </h2>
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            {filteredMedicines.length} {filteredMedicines.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {filteredMedicines.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">No medicines found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Try adjusting your search or browse different categories.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMedicines.map((medicine) => (
              <MedicineCard
                key={medicine.id}
                medicine={medicine}
                onAddToCart={handleAddToCart}
                cartQuantity={getCartQuantity(medicine.id)}
                onAutoRefill={openAutoRefill}
                autoRefillEnabled={autoRefillSettings[medicine.id]?.enabled}
                insuranceCoverage={getInsuranceCoverage(medicine)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <CartModal
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      <OrderSuccessModal
        isOpen={showOrderSuccess}
        onClose={() => setShowOrderSuccess(false)}
        order={completedOrder}
      />

      <AutoRefillModal
        isOpen={showAutoRefill}
        onClose={() => setShowAutoRefill(false)}
        medicine={selectedMedicine}
        onSaveSettings={handleAutoRefillSettings}
      />

      <InsuranceModal
        isOpen={showInsurance}
        onClose={() => setShowInsurance(false)}
        onSaveInsurance={handleInsuranceInfo}
      />
    </div>
  );
}

export default function ChatDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const section = searchParams.get('section') || 'consultations';
  const [searchQuery, setSearchQuery] = useState('');
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showChatbot, setShowChatbot] = useState(false);

  useEffect(() => {
    if (section === 'consultations') {
      fetchChats();
    } else {
      // Reset chatbot when switching sections
      setShowChatbot(false);
    }
  }, [section]);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await chatAPI.getChats();
      setConsultations(response.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching chats:', err);

      const mockConsultations = [
        {
          id: 1,
          title: 'Flu Symptoms Consultation',
          date: 'Feb 8, 2026',
          status: 'completed',
          summary: 'Discussed mild fever and sore throat symptoms. Received care recommendations including rest and hydration.',
          pinned: false,
          archived: false
        },
        {
          id: 2,
          title: 'Follow-up Check',
          date: 'Feb 7, 2026',
          status: 'in-progress',
          summary: 'Follow-up consultation regarding previous symptoms and medication effectiveness.',
          pinned: true,
          archived: false
        },
        {
          id: 3,
          title: 'Allergy Consultation',
          date: 'Feb 5, 2026',
          status: 'completed',
          summary: 'Discussed seasonal allergy symptoms and reviewed possible treatment options.',
          pinned: false,
          archived: false
        },
        {
          id: 4,
          title: 'General Health Check',
          date: 'Jan 30, 2026',
          status: 'completed',
          summary: 'Routine health consultation covering general wellness and lifestyle recommendations.',
          pinned: false,
          archived: true
        }
      ];

      setConsultations(mockConsultations);
      setError('');
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setShowChatbot(true);
  };

  const handleCloseChatbot = () => {
    setShowChatbot(false);
  };

  const handleResumeChat = (chatId) => {
    // Open chatbot with the specific chat ID
    // For now, just open the chatbot (you can add chatId handling later)
    setShowChatbot(true);
  };

  const handleConsultationUpdate = async (updatedConsultation, action = 'update') => {
    if (action === 'delete') {
      setConsultations(prevConsultations =>
        prevConsultations.filter(c => c.id !== updatedConsultation.id)
      );
    } else {
      setConsultations(prevConsultations =>
        prevConsultations.map(c =>
          c.id === updatedConsultation.id ? updatedConsultation : c
        )
      );
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const filteredConsultations = consultations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render section based on selection
  const renderContent = () => {
    if (section === 'daily-plan') {
      return <DailyPlanSection />;
    }
    if (section === 'carepath') {
      return <CarePathSection />;
    }
    if (section === 'reminders') {
      return <RemindersSection navigate={navigate} />;
    }
    if (section === 'pharmacy') {
      return <PharmacySection />;
    }
    if (section === 'food') {
      return <FoodAdvisorSection />;
    }
    if (section === 'health-profile') {
      return <HealthProfileSection />;
    }
    if (section === 'history') {
      return <HistorySection />;
    }
    if (section === 'settings') {
      return <SettingsSection />;
    }

    // Default: Consultations Section
    // Show chatbot if active
    if (showChatbot) {
      return <EmbeddedChatbot onClose={handleCloseChatbot} />;
    }

    return (
      <>
        {/* Greeting */}
        <div className="flex flex-wrap justify-between items-end gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">
              {getGreeting()}, {user?.name || 'Guest'}
            </h1>
            <p className="text-gray-600 dark:text-muted text-base font-normal">
              Manage your health conversations and insights.
            </p>
          </div>
        </div>

        {/* Hero CTA Section */}
        <div className="w-full rounded-2xl overflow-hidden relative group">
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
              <button
                onClick={handleNewChat}
                className="flex items-center gap-2 h-12 px-6 bg-primary hover:bg-blue-600 text-white text-base font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all transform hover:scale-105 active:scale-95"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Start New Consultation</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search & Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-4">
          <h2 className="text-[22px] font-bold leading-tight tracking-tight text-gray-900 dark:text-white">Recent Consultations</h2>
          <div className="w-full md:w-auto min-w-[320px]">
            <label className="flex w-full items-center h-11 rounded-lg bg-white dark:bg-card-dark border border-gray-300 dark:border-sidebar-border overflow-hidden focus-within:ring-2 ring-primary/50 transition-shadow">
              <div className="pl-3 pr-2 text-gray-400 dark:text-muted flex items-center justify-center">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-full bg-transparent border-none text-sm font-medium placeholder:text-gray-400 dark:placeholder:text-muted focus:ring-0 focus:outline-none p-0 text-gray-900 dark:text-white"
                placeholder="Search by symptom or date..."
              />
            </label>
          </div>
        </div>

        {/* Consultations Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 dark:text-red-400">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-10">
            {filteredConsultations.map((consultation) => (
              <ConsultationCard
                key={consultation.id}
                consultation={consultation}
                onClick={handleResumeChat}
                onUpdate={handleConsultationUpdate}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredConsultations.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-muted text-lg">
              {searchQuery ? `No consultations found matching "${searchQuery}"` : 'No consultations yet. Start your first consultation above!'}
            </p>
          </div>
        )}
      </>
    );
  };

  return (
    <DashboardLayout>
      <div className="w-full px-6 py-8 md:px-10 lg:px-16 lg:py-10 max-w-[1200px] mx-auto flex flex-col gap-6">
        {renderContent()}
      </div>
    </DashboardLayout>
  );
}

