import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    attachments: [{
        type: String,
        url: String
    }]
});

const chatSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    messages: [messageSchema],
    status: {
        type: String,
        enum: ['active', 'resolved', 'archived'],
        default: 'active'
    },
    category: {
        type: String,
        enum: ['general', 'symptoms', 'medication', 'emergency', 'follow-up'],
        default: 'general'
    },
    aiSummary: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp on save
chatSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model('Chat', chatSchema);
