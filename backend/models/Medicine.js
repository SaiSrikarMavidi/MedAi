import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please add medicine name'],
        trim: true
    },
    dosage: {
        type: String,
        required: true
    },
    frequency: {
        type: String,
        required: true
    },
    timings: [{
        time: String,
        taken: {
            type: Boolean,
            default: false
        },
        takenAt: Date
    }],
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    },
    prescribedBy: {
        type: String,
        default: ''
    },
    purpose: {
        type: String,
        default: ''
    },
    sideEffects: [String],
    instructions: {
        type: String,
        default: ''
    },
    reminderEnabled: {
        type: Boolean,
        default: true
    },
    stock: {
        type: Number,
        default: 0
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

medicineSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model('Medicine', medicineSchema);
