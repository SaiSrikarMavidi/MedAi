import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Mock doctors data (replace with database later)
const mockDoctors = [
    {
        id: '1',
        name: 'Dr. Sarah Johnson',
        specialty: 'General Physician',
        rating: 4.8,
        experience: 15,
        availability: 'Available Today',
        location: 'New York, NY',
        distance: '2.5 km',
        fee: 150
    },
    {
        id: '2',
        name: 'Dr. Michael Chen',
        specialty: 'Cardiologist',
        rating: 4.9,
        experience: 20,
        availability: 'Available Tomorrow',
        location: 'New York, NY',
        distance: '3.2 km',
        fee: 200
    }
];

// @route   GET /api/doctors/search
// @desc    Search doctors
// @access  Private
router.get('/search', protect, async (req, res) => {
    try {
        const { specialty, location } = req.query;

        // TODO: Implement actual database query
        let results = mockDoctors;

        if (specialty) {
            results = results.filter(doc => 
                doc.specialty.toLowerCase().includes(specialty.toLowerCase())
            );
        }

        res.json({
            success: true,
            data: results
        });
    } catch (error) {
        console.error('Search doctors error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/doctors/nearby
// @desc    Get nearby doctors
// @access  Private
router.get('/nearby', protect, async (req, res) => {
    try {
        const { latitude, longitude, radius = 10 } = req.query;

        // TODO: Implement geospatial query with Google Maps API
        res.json({
            success: true,
            data: mockDoctors
        });
    } catch (error) {
        console.error('Get nearby doctors error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/doctors/:id/book
// @desc    Book appointment
// @access  Private
router.post('/:id/book', protect, async (req, res) => {
    try {
        const { date, time, reason } = req.body;

        // TODO: Implement actual booking logic
        const appointment = {
            id: Date.now().toString(),
            doctorId: req.params.id,
            userId: req.user.id,
            date,
            time,
            reason,
            status: 'confirmed'
        };

        res.status(201).json({
            success: true,
            data: appointment
        });
    } catch (error) {
        console.error('Book appointment error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

export default router;
