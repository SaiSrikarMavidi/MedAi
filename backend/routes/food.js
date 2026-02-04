import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Mock food database
const mockFoods = {
    safe: [
        { name: 'Brown Rice', category: 'Grains', calories: 216, protein: 5, carbs: 45, fat: 2 },
        { name: 'Grilled Chicken', category: 'Protein', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
        { name: 'Steamed Broccoli', category: 'Vegetables', calories: 55, protein: 4, carbs: 11, fat: 0.6 }
    ],
    limit: [
        { name: 'White Bread', category: 'Grains', calories: 265, protein: 9, carbs: 49, fat: 3.2 },
        { name: 'Butter', category: 'Fats', calories: 717, protein: 0.9, carbs: 0.1, fat: 81 }
    ],
    avoid: [
        { name: 'Fried Chicken', category: 'Fast Food', calories: 320, protein: 24, carbs: 16, fat: 17 },
        { name: 'Soda', category: 'Beverages', calories: 140, protein: 0, carbs: 39, fat: 0 }
    ]
};

// @route   GET /api/food/search
// @desc    Search foods
// @access  Private
router.get('/search', protect, async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.json({
                success: true,
                data: {
                    safe: mockFoods.safe.slice(0, 5),
                    limit: mockFoods.limit.slice(0, 3),
                    avoid: mockFoods.avoid.slice(0, 3)
                }
            });
        }

        // Simple search
        const searchLower = query.toLowerCase();
        const results = {
            safe: mockFoods.safe.filter(f => f.name.toLowerCase().includes(searchLower)),
            limit: mockFoods.limit.filter(f => f.name.toLowerCase().includes(searchLower)),
            avoid: mockFoods.avoid.filter(f => f.name.toLowerCase().includes(searchLower))
        };

        res.json({
            success: true,
            data: results
        });
    } catch (error) {
        console.error('Search food error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/food/check
// @desc    Check if food is safe
// @access  Private
router.post('/check', protect, async (req, res) => {
    try {
        const { foodName } = req.body;

        // TODO: Implement AI-based food analysis
        const isSafe = !mockFoods.avoid.some(f => 
            f.name.toLowerCase() === foodName.toLowerCase()
        );

        res.json({
            success: true,
            data: {
                safe: isSafe,
                recommendation: isSafe ? 'Safe to consume' : 'Better to avoid',
                alternatives: isSafe ? [] : mockFoods.safe.slice(0, 3)
            }
        });
    } catch (error) {
        console.error('Check food error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/food/recommendations
// @desc    Get personalized food recommendations
// @access  Private
router.get('/recommendations', protect, async (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                breakfast: mockFoods.safe.slice(0, 2),
                lunch: mockFoods.safe.slice(1, 3),
                dinner: mockFoods.safe.slice(0, 3)
            }
        });
    } catch (error) {
        console.error('Get recommendations error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

export default router;
