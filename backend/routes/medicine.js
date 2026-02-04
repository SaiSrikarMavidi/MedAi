import express from 'express';
import Medicine from '../models/Medicine.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/medicines
// @desc    Get all user medicines
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const medicines = await Medicine.find({ userId: req.user.id })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: medicines
        });
    } catch (error) {
        console.error('Get medicines error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/medicines
// @desc    Add new medicine
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const medicineData = {
            ...req.body,
            userId: req.user.id
        };

        const medicine = await Medicine.create(medicineData);

        res.status(201).json({
            success: true,
            data: medicine
        });
    } catch (error) {
        console.error('Add medicine error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PUT /api/medicines/:id/mark-taken
// @desc    Mark medicine as taken
// @access  Private
router.put('/:id/mark-taken', protect, async (req, res) => {
    try {
        const { timingIndex } = req.body;

        const medicine = await Medicine.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!medicine) {
            return res.status(404).json({
                success: false,
                message: 'Medicine not found'
            });
        }

        if (medicine.timings[timingIndex]) {
            medicine.timings[timingIndex].taken = true;
            medicine.timings[timingIndex].takenAt = new Date();
            await medicine.save();
        }

        res.json({
            success: true,
            data: medicine
        });
    } catch (error) {
        console.error('Mark medicine taken error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   DELETE /api/medicines/:id
// @desc    Delete medicine
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const medicine = await Medicine.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!medicine) {
            return res.status(404).json({
                success: false,
                message: 'Medicine not found'
            });
        }

        res.json({
            success: true,
            message: 'Medicine deleted'
        });
    } catch (error) {
        console.error('Delete medicine error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

export default router;
