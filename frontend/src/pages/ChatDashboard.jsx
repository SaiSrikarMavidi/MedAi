import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, MessageSquare, Clock, ArrowRight, Search } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const ChatDashboard = () => {
    const [chatSessions, setChatSessions] = useState([
        {
            id: 1,
            title: 'Headache and Fever',
            lastMessage: 'Based on your symptoms, I recommend...',
            timestamp: '2 hours ago',
            unread: false
        },
        {
            id: 2,
            title: 'Skin Rash Consultation',
            lastMessage: 'Please upload a clear image of the affected area',
            timestamp: '1 day ago',
            unread: true
        },
        {
            id: 3,
            title: 'Diabetes Management',
            lastMessage: 'Your blood sugar levels are within normal range',
            timestamp: '3 days ago',
            unread: false
        }
    ]);

    const [searchQuery, setSearchQuery] = useState('');

    const filteredChats = chatSessions.filter(chat =>
        chat.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleNewChat = () => {
        // TODO: Navigate to new chat
        console.log('Creating new chat...');
    };

    const handleChatClick = (chatId) => {
        // TODO: Navigate to chat
        console.log('Opening chat:', chatId);
    };

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Header */}
            <div className="bg-white border-b border-neutral-200">
                <div className="container-swiss py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-semibold text-neutral-900 mb-1">Your Conversations</h1>
                            <p className="text-neutral-600">Continue where you left off or start a new consultation</p>
                        </div>
                        <Button
                            variant="primary"
                            size="lg"
                            icon={<Plus className="w-5 h-5" />}
                            onClick={handleNewChat}
                        >
                            New Chat
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container-swiss py-8">
                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {/* Chat Sessions Grid */}
                {filteredChats.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredChats.map((chat, index) => (
                            <motion.div
                                key={chat.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card
                                    hover
                                    onClick={() => handleChatClick(chat.id)}
                                    className="h-full"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                                                    <MessageSquare className="w-5 h-5 text-primary-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-neutral-900">{chat.title}</h3>
                                                    {chat.unread && (
                                                        <span className="inline-block w-2 h-2 bg-primary-600 rounded-full"></span>
                                                    )}
                                                </div>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-primary-600 transition-colors" />
                                        </div>

                                        <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                                            {chat.lastMessage}
                                        </p>

                                        <div className="flex items-center gap-1 text-xs text-neutral-500">
                                            <Clock className="w-3 h-3" />
                                            <span>{chat.timestamp}</span>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <MessageSquare className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-neutral-900 mb-2">No conversations found</h3>
                        <p className="text-neutral-600 mb-6">Try adjusting your search or start a new chat</p>
                        <Button variant="primary" icon={<Plus className="w-5 h-5" />} onClick={handleNewChat}>
                            Start New Chat
                        </Button>
                    </motion.div>
                )}

                {/* Empty State for New Users */}
                {chatSessions.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-2xl mx-auto text-center py-16"
                    >
                        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <MessageSquare className="w-10 h-10 text-primary-600" />
                        </div>
                        <h2 className="text-3xl font-semibold text-neutral-900 mb-3">Welcome to MediAI</h2>
                        <p className="text-lg text-neutral-600 mb-8">
                            Start your first conversation with our AI health assistant. Describe your symptoms, upload medical images, and get intelligent health guidance.
                        </p>
                        <Button
                            variant="primary"
                            size="xl"
                            icon={<Plus className="w-6 h-6" />}
                            onClick={handleNewChat}
                        >
                            Start Your First Chat
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ChatDashboard;
