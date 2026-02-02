import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, Image as ImageIcon, FileText, X, Bot, User as UserIcon, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';

const Chatbot = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            content: 'Hello! I\'m your AI health assistant. How can I help you today? You can describe your symptoms or upload medical images/reports.',
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        const newFiles = files.map(file => ({
            id: Date.now() + Math.random(),
            file,
            name: file.name,
            type: file.type,
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
        }));
        setUploadedFiles([...uploadedFiles, ...newFiles]);
    };

    const removeFile = (fileId) => {
        setUploadedFiles(uploadedFiles.filter(f => f.id !== fileId));
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim() && uploadedFiles.length === 0) return;

        const newMessage = {
            id: Date.now(),
            type: 'user',
            content: inputMessage,
            files: uploadedFiles,
            timestamp: new Date()
        };

        setMessages([...messages, newMessage]);
        setInputMessage('');
        setUploadedFiles([]);
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const aiResponse = {
                id: Date.now() + 1,
                type: 'bot',
                content: 'Based on your symptoms, I\'m analyzing the information. This appears to be a common condition. Let me provide you with a detailed assessment and recommendations.',
                analysis: {
                    severity: 'moderate',
                    recommendation: 'Online Consultation',
                    summary: 'Your symptoms suggest a possible viral infection. I recommend consulting with a general physician.',
                },
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 2000);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col h-screen bg-neutral-50">
            {/* Header */}
            <div className="bg-white border-b border-neutral-200 px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                        <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-neutral-900">AI Health Assistant</h2>
                        <p className="text-sm text-neutral-600">Always here to help</p>
                    </div>
                </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin">
                <div className="max-w-4xl mx-auto space-y-6">
                    <AnimatePresence>
                        {messages.map((message) => (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                            >
                                {/* Avatar */}
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${message.type === 'bot' ? 'bg-primary-100' : 'bg-neutral-200'
                                    }`}>
                                    {message.type === 'bot' ? (
                                        <Bot className="w-5 h-5 text-primary-600" />
                                    ) : (
                                        <UserIcon className="w-5 h-5 text-neutral-600" />
                                    )}
                                </div>

                                {/* Message Content */}
                                <div className={`flex-1 max-w-2xl ${message.type === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                                    <div className={`rounded-2xl px-4 py-3 ${message.type === 'bot'
                                            ? 'bg-white border border-neutral-200'
                                            : 'bg-primary-600 text-white'
                                        }`}>
                                        <p className="text-sm leading-relaxed">{message.content}</p>

                                        {/* Display uploaded files */}
                                        {message.files && message.files.length > 0 && (
                                            <div className="mt-3 space-y-2">
                                                {message.files.map(file => (
                                                    <div key={file.id} className="flex items-center gap-2 bg-neutral-100 rounded-lg p-2">
                                                        {file.preview ? (
                                                            <img src={file.preview} alt={file.name} className="w-16 h-16 object-cover rounded" />
                                                        ) : (
                                                            <FileText className="w-8 h-8 text-neutral-400" />
                                                        )}
                                                        <span className="text-xs text-neutral-700">{file.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* AI Analysis Card */}
                                        {message.analysis && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="mt-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200"
                                            >
                                                <h4 className="font-semibold text-neutral-900 mb-2 flex items-center gap-2">
                                                    <AlertCircle className="w-4 h-4" />
                                                    Health Analysis
                                                </h4>
                                                <div className="space-y-2 text-sm text-neutral-700">
                                                    <div className="flex justify-between">
                                                        <span className="font-medium">Severity:</span>
                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${message.analysis.severity === 'low' ? 'bg-green-100 text-green-700' :
                                                                message.analysis.severity === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                                                                    'bg-red-100 text-red-700'
                                                            }`}>
                                                            {message.analysis.severity}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="font-medium">Recommendation:</span>
                                                        <span className="text-primary-600 font-medium">{message.analysis.recommendation}</span>
                                                    </div>
                                                    <p className="pt-2 border-t border-neutral-200">{message.analysis.summary}</p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                    <span className="text-xs text-neutral-500 mt-1 px-2">
                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Typing Indicator */}
                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-3"
                        >
                            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                                <Bot className="w-5 h-5 text-primary-600" />
                            </div>
                            <div className="bg-white border border-neutral-200 rounded-2xl px-4 py-3">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-neutral-200 px-6 py-4">
                <div className="max-w-4xl mx-auto">
                    {/* File Preview */}
                    {uploadedFiles.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-3 flex gap-2 flex-wrap"
                        >
                            {uploadedFiles.map(file => (
                                <div key={file.id} className="relative group">
                                    {file.preview ? (
                                        <div className="relative">
                                            <img src={file.preview} alt={file.name} className="w-20 h-20 object-cover rounded-lg border border-neutral-200" />
                                            <button
                                                onClick={() => removeFile(file.id)}
                                                className="absolute -top-2 -right-2 w-6 h-6 bg-error text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="relative flex items-center gap-2 bg-neutral-100 rounded-lg px-3 py-2 pr-8">
                                            <FileText className="w-5 h-5 text-neutral-400" />
                                            <span className="text-sm text-neutral-700 max-w-[100px] truncate">{file.name}</span>
                                            <button
                                                onClick={() => removeFile(file.id)}
                                                className="absolute right-1 top-1/2 -translate-y-1/2 w-5 h-5 bg-error text-white rounded-full flex items-center justify-center"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {/* Input Box */}
                    <div className="flex gap-2 items-end">
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*,.pdf"
                            onChange={handleFileUpload}
                            className="hidden"
                        />

                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-neutral-300 hover:border-primary-500 hover:bg-primary-50 transition-all"
                        >
                            <Paperclip className="w-5 h-5 text-neutral-600" />
                        </button>

                        <div className="flex-1 relative">
                            <textarea
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Describe your symptoms or health concerns..."
                                rows={1}
                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-all"
                                style={{ minHeight: '44px', maxHeight: '120px' }}
                            />
                        </div>

                        <Button
                            variant="primary"
                            size="md"
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim() && uploadedFiles.length === 0}
                            icon={<Send className="w-5 h-5" />}
                            className="h-11"
                        >
                            Send
                        </Button>
                    </div>

                    <p className="text-xs text-neutral-500 text-center mt-2">
                        MediAI provides health guidance only. For emergencies, call your local emergency services.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
