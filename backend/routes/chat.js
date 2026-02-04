import express from 'express';
import Chat from '../models/Chat.js';
import { protect } from '../middleware/auth.js';
import OpenAI from 'openai';

const router = express.Router();

// Initialize OpenAI (if API key is available)
let openai;
if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });
}

// @route   GET /api/chat
// @desc    Get all user chats
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const chats = await Chat.find({ userId: req.user.id })
            .sort({ updatedAt: -1 })
            .select('-messages'); // Exclude messages for list view

        res.json({
            success: true,
            data: chats
        });
    } catch (error) {
        console.error('Get chats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/chat/:id
// @desc    Get single chat with messages
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const chat = await Chat.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: 'Chat not found'
            });
        }

        res.json({
            success: true,
            data: chat
        });
    } catch (error) {
        console.error('Get chat error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/chat
// @desc    Create new chat
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { title, description, category } = req.body;

        const chat = await Chat.create({
            userId: req.user.id,
            title: title || 'New Consultation',
            description: description || '',
            category: category || 'general',
            messages: []
        });

        res.status(201).json({
            success: true,
            data: chat
        });
    } catch (error) {
        console.error('Create chat error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/chat/:id/messages
// @desc    Send message in chat
// @access  Private
router.post('/:id/messages', protect, async (req, res) => {
    try {
        const { message } = req.body;

        const chat = await Chat.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: 'Chat not found'
            });
        }

        // Add user message
        chat.messages.push({
            role: 'user',
            content: message,
            timestamp: new Date()
        });

        // Generate AI response
        let aiResponse = "I'm here to help with your health concerns. However, the AI service is currently unavailable. Please consult with a healthcare professional for medical advice.";

        if (openai) {
            try {
                const completion = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: "You are a helpful medical AI assistant. Provide information and guidance, but always remind users to consult healthcare professionals for serious concerns."
                        },
                        ...chat.messages.slice(-5).map(msg => ({
                            role: msg.role,
                            content: msg.content
                        }))
                    ],
                    max_tokens: 500
                });

                aiResponse = completion.choices[0].message.content;
            } catch (aiError) {
                console.error('OpenAI error:', aiError);
            }
        }

        // Add AI response
        chat.messages.push({
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date()
        });

        await chat.save();

        res.json({
            success: true,
            data: {
                userMessage: chat.messages[chat.messages.length - 2],
                aiMessage: chat.messages[chat.messages.length - 1]
            }
        });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/chat/analyze
// @desc    Analyze health issue
// @access  Private
router.post('/analyze', protect, async (req, res) => {
    try {
        const { symptoms, duration, severity } = req.body;

        let analysis = {
            urgency: 'moderate',
            recommendation: 'self-care',
            message: 'Based on your symptoms, self-care measures may be appropriate. Monitor your condition.'
        };

        if (openai) {
            try {
                const prompt = `Analyze these health symptoms and provide urgency level (low/moderate/high) and recommendation (self-care/online-consultation/physical-consultation):
                
Symptoms: ${symptoms}
Duration: ${duration}
Severity: ${severity}

Respond in JSON format: {"urgency": "", "recommendation": "", "message": ""}`;

                const completion = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: prompt }],
                    max_tokens: 300
                });

                const response = completion.choices[0].message.content;
                analysis = JSON.parse(response);
            } catch (aiError) {
                console.error('OpenAI analysis error:', aiError);
            }
        }

        res.json({
            success: true,
            data: analysis
        });
    } catch (error) {
        console.error('Analyze error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

export default router;
