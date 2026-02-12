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

// @route   GET /api/food/recommended
// @desc    Get personalized food recommendations
// @access  Private
router.get('/recommended', protect, async (req, res) => {
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

// @route   GET /api/food/meal-plan
// @desc    Generate daily meal plan
// @access  Private
router.get('/meal-plan', protect, async (req, res) => {
    try {
        const mealPlan = {
            breakfast: [
                { name: 'Oatmeal with berries', calories: 150 },
                { name: 'Greek yogurt', calories: 100 },
                { name: 'Green tea', calories: 5 }
            ],
            lunch: [
                { name: 'Grilled chicken salad', calories: 280 },
                { name: 'Brown rice', calories: 110 },
                { name: 'Water', calories: 0 }
            ],
            dinner: [
                { name: 'Baked salmon', calories: 200 },
                { name: 'Steamed broccoli', calories: 55 },
                { name: 'Quinoa', calories: 120 }
            ],
            snack: [
                { name: 'Mixed nuts', calories: 160 },
                { name: 'Apple slices', calories: 80 }
            ]
        };

        res.json({
            success: true,
            data: mealPlan
        });
    } catch (error) {
        console.error('Get meal plan error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

export default router;
