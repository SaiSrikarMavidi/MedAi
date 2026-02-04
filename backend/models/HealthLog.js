import mongoose from 'mongoose';

const healthLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    vitals: {
        bloodPressure: {
            systolic: Number,
            diastolic: Number
        },
        bloodSugar: Number,
        heartRate: Number,
        weight: Number,
        temperature: Number,
        oxygenLevel: Number
    },
    sleep: {
        type: Number,
        default: 0
    },
    exercise: {
        type: Number,
        default: 0
    },
    mood: {
        type: String,
        enum: ['great', 'good', 'okay', 'bad'],
        default: 'good'
    },
    symptoms: [String],
    notes: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for efficient querying
healthLogSchema.index({ userId: 1, date: -1 });

export default mongoose.model('HealthLog', healthLogSchema);
