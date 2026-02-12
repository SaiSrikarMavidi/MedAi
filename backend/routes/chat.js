import express from 'express';
import dotenv from 'dotenv';
import Chat from '../models/Chat.js';
import { protect } from '../middleware/auth.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Ensure env vars are loaded even though routes are imported before server.js calls dotenv.config()
dotenv.config();

const router = express.Router();

// Initialize Gemini client (if API key is available)
let genAI;
let model;
if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    console.log('✅ Gemini AI initialized');
} else {
    console.warn('⚠️  GEMINI_API_KEY is not set. Chatbot responses will be unavailable.');
}

// In‑memory conversation history for the simple chatbot endpoint.
// Keyed by authenticated user id so each user has their own short history.
// NOTE: This is ephemeral and will reset on server restart, which is acceptable
// for short-lived conversational context.
const simpleChatHistories = new Map(); // Map<userId, Array<{ role, content }>>

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
// @desc    Create new chat OR send simple message to LLM (stateless chat UI)
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        // Simple chatbot message path
        if (typeof req.body.message === 'string') {
            const { message } = req.body;

            if (!message.trim()) {
                return res.status(400).json({ error: 'Message is required' });
            }

            if (!model) {
                console.error('Gemini client not configured');
                return res.status(500).json({ error: 'Failed to generate response' });
            }

            try {
                const userId = req.user?.id?.toString() || 'anonymous';

                // Get existing history for this user (if any)
                let history = simpleChatHistories.get(userId) || [];

                // Build conversation context for Gemini
                const systemPrompt = `You are MediAI, a compassionate and knowledgeable medical AI assistant. Your role is to provide helpful health information and guidance.

Guidelines:
- Be empathetic and understanding of the user's concerns
- Provide clear, evidence-based information in simple language
- Structure responses with bullet points or numbered lists when appropriate
- Always include relevant safety warnings and red flags
- Remind users to seek immediate medical attention for emergencies (severe pain, difficulty breathing, chest pain, etc.)
- Encourage consulting healthcare professionals for diagnosis and treatment
- Never provide specific medication dosages or prescriptions
- Be concise but thorough - aim for 3-5 key points per response

Disclaimer: Always end responses with a brief reminder that you're an AI assistant and cannot replace professional medical advice.`;

                // Format conversation history for Gemini
                let conversationText = systemPrompt + '\n\n';
                history.forEach(msg => {
                    conversationText += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
                });
                conversationText += `User: ${message}\nAssistant:`;

                // Configure generation parameters for medical responses
                const generationConfig = {
                    temperature: 0.7, // Balanced between creativity and consistency
                    topP: 0.9,
                    topK: 40,
                    maxOutputTokens: 1024,
                };

                const result = await model.generateContent({
                    contents: [{ role: 'user', parts: [{ text: conversationText }] }],
                    generationConfig,
                });
                const response = await result.response;
                const aiResponse = response.text() || 'No response received from AI.';

                // Store conversation history
                history.push({ role: 'user', content: message });
                history.push({ role: 'assistant', content: aiResponse });

                // Keep only last 5 exchanges (i.e., ~10 messages total)
                simpleChatHistories.set(userId, history.slice(-10));

                return res.json({ reply: aiResponse });
            } catch (aiError) {
                console.error('Gemini /api/chat error:', aiError);
                return res.status(500).json({ error: 'Failed to generate response' });
            }
        }

        // Existing logic: Create new chat (non-simple, stored in DB)
        const { title, description, category } = req.body;

        const chat = await Chat.create({
            userId: req.user.id,
            title: title || 'New Consultation',
            description: description || '',
            category: category || 'general',
            messages: [],
        });

        res.status(201).json({
            success: true,
            data: chat,
        });
    } catch (error) {
        console.error('Create chat/message error:', error);

        res.status(500).json({
            success: false,
            message: 'Server error',
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

        if (model) {
            try {
                // Build conversation context for Gemini
                const systemPrompt = `You are MediAI, a compassionate and knowledgeable medical AI assistant. Your role is to provide helpful health information and guidance.

Guidelines:
- Be empathetic and understanding of the user's concerns
- Provide clear, evidence-based information in simple language
- Structure responses with bullet points or numbered lists when appropriate
- Always include relevant safety warnings and red flags
- Remind users to seek immediate medical attention for emergencies (severe pain, difficulty breathing, chest pain, etc.)
- Encourage consulting healthcare professionals for diagnosis and treatment
- Never provide specific medication dosages or prescriptions
- Be concise but thorough - aim for 3-5 key points per response

Disclaimer: Always end responses with a brief reminder that you're an AI assistant and cannot replace professional medical advice.`;

                // Format conversation history for Gemini
                let conversationText = systemPrompt + '\n\n';
                chat.messages.slice(-6).forEach(msg => {
                    conversationText += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
                });
                conversationText += 'Assistant:';

                // Configure generation parameters for medical responses
                const generationConfig = {
                    temperature: 0.7, // Balanced between creativity and consistency
                    topP: 0.9,
                    topK: 40,
                    maxOutputTokens: 1024,
                };

                const result = await model.generateContent({
                    contents: [{ role: 'user', parts: [{ text: conversationText }] }],
                    generationConfig,
                });
                const response = await result.response;
                aiResponse = response.text() || aiResponse;
            } catch (aiError) {
                console.error('Gemini error:', aiError);
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

        if (model) {
            try {
                const prompt = `Analyze these health symptoms and provide urgency level (low/moderate/high) and recommendation (self-care/online-consultation/physical-consultation):
                
Symptoms: ${symptoms}
Duration: ${duration}
Severity: ${severity}

Respond in JSON format: {"urgency": "", "recommendation": "", "message": ""}`;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                const responseText = response.text();

                if (responseText) {
                    // Attempt to parse JSON from response
                    try {
                        // Extract JSON if wrapped in markdown code blocks
                        let jsonStr = responseText;
                        if (jsonStr.includes('```json')) {
                            jsonStr = jsonStr.split('```json')[1].split('```')[0].trim();
                        } else if (jsonStr.includes('```')) {
                            jsonStr = jsonStr.split('```')[1].split('```')[0].trim();
                        }
                        analysis = JSON.parse(jsonStr);
                    } catch (e) {
                        console.error('JSON parse error from AI response:', e);
                    }
                }
            } catch (aiError) {
                console.error('Gemini analysis error:', aiError);
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
