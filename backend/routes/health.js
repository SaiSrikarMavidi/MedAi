import express from 'express';
import HealthLog from '../models/HealthLog.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/health/logs
// @desc    Get user health logs
// @access  Private
router.get('/logs', protect, async (req, res) => {
    try {
        const { startDate, endDate, limit = 30 } = req.query;

        const query = { userId: req.user.id };

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const logs = await HealthLog.find(query)
            .sort({ date: -1 })
            .limit(parseInt(limit));

        res.json({
            success: true,
            data: logs
        });
    } catch (error) {
        console.error('Get health logs error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/health/logs
// @desc    Add health log
// @access  Private
router.post('/logs', protect, async (req, res) => {
    try {
        const logData = {
            ...req.body,
            userId: req.user.id
        };

        const log = await HealthLog.create(logData);

        res.status(201).json({
            success: true,
            data: log
        });
    } catch (error) {
        console.error('Add health log error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/health/trends
// @desc    Get health trends
// @access  Private
router.get('/trends', protect, async (req, res) => {
    try {
        const { days = 7 } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        const logs = await HealthLog.find({
            userId: req.user.id,
            date: { $gte: startDate }
        }).sort({ date: 1 });

        // Calculate trends
        const trends = {
            bloodPressure: [],
            weight: [],
            bloodSugar: [],
            heartRate: [],
            sleep: [],
            exercise: []
        };

        logs.forEach(log => {
            const dateStr = log.date.toISOString().split('T')[0];

            if (log.vitals?.bloodPressure?.systolic) {
                trends.bloodPressure.push({
                    date: dateStr,
                    systolic: log.vitals.bloodPressure.systolic,
                    diastolic: log.vitals.bloodPressure.diastolic
                });
            }

            if (log.vitals?.weight) {
                trends.weight.push({ date: dateStr, value: log.vitals.weight });
            }

            if (log.vitals?.bloodSugar) {
                trends.bloodSugar.push({ date: dateStr, value: log.vitals.bloodSugar });
            }

            if (log.vitals?.heartRate) {
                trends.heartRate.push({ date: dateStr, value: log.vitals.heartRate });
            }

            if (log.sleep) {
                trends.sleep.push({ date: dateStr, value: log.sleep });
            }

            if (log.exercise) {
                trends.exercise.push({ date: dateStr, value: log.exercise });
            }
        });

        res.json({
            success: true,
            data: trends
        });
    } catch (error) {
        console.error('Get trends error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

export default router;
