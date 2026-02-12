import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').optional().trim()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { name, email, password, phone } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Check if phone number already exists
        if (phone) {
            const phoneExists = await User.findOne({ phone });
            if (phoneExists) {
                return res.status(400).json({
                    success: false,
                    message: 'User already exists with this phone number'
                });
            }
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            ...(phone && { phone })
        });

        if (user) {
            res.status(201).json({
                success: true,
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    token: generateToken(user._id)
                }
            });
        }
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
    body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Please provide a valid email address'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                message: errors.array()[0].msg,
                errors: errors.array() 
            });
        }

        const { email, password } = req.body;

        // Check user exists
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        res.json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
});

// @route   POST /api/auth/request-otp
// @desc    Request OTP for login
// @access  Public
router.post('/request-otp', async (req, res) => {
    try {
        const { mobile, email } = req.body;
        const identifier = mobile || email;

        if (!identifier) {
            return res.status(400).json({
                success: false,
                message: 'Mobile number or email is required'
            });
        }

        // Find user by phone or email
        const user = await User.findOne({
            $or: [
                { phone: identifier },
                { email: identifier }
            ]
        });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found with this mobile number or email'
            });
        }

        // Generate 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        user.otp = {
            code: otpCode,
            expiresAt
        };
        await user.save();

        res.json({
            success: true,
            message: 'OTP sent successfully',
            // Only for development - remove in production
            ...(process.env.NODE_ENV === 'development' && { otp: otpCode })
        });
    } catch (error) {
        console.error('Request OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and login
// @access  Public
router.post('/verify-otp', async (req, res) => {
    try {
        const { mobile, email, otp } = req.body;
        const identifier = mobile || email;

        if (!identifier || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Mobile number/email and OTP are required'
            });
        }

        // Find user by phone or email
        const user = await User.findOne({
            $or: [
                { phone: identifier },
                { email: identifier }
            ]
        });
        
        if (!user || !user.otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP or user not found'
            });
        }

        // Check OTP expiry
        if (user.otp.expiresAt < new Date()) {
            return res.status(400).json({
                success: false,
                message: 'OTP expired. Please request a new one'
            });
        }

        // Verify OTP
        if (user.otp.code !== otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP code'
            });
        }

        // Clear OTP
        user.otp = undefined;
        await user.save();

        res.json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            }
        });
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/auth/google
// @desc    Redirect to Google OAuth
// @access  Public
router.get('/google', (req, res) => {
    const redirectUri = `${req.protocol}://${req.get('host')}/api/auth/google/callback`;
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${process.env.GOOGLE_CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=code` +
        `&scope=openid%20email%20profile` +
        `&access_type=offline`;
    
    res.redirect(googleAuthUrl);
});

// @route   GET /api/auth/google/callback
// @desc    Handle Google OAuth callback
// @access  Public
router.get('/google/callback', async (req, res) => {
    const { code } = req.query;
    
    if (!code) {
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=no_code`);
    }
    
    try {
        // Exchange code for tokens
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: `${req.protocol}://${req.get('host')}/api/auth/google/callback`,
                grant_type: 'authorization_code'
            })
        });
        
        const tokens = await tokenResponse.json();
        
        if (!tokens.access_token) {
            throw new Error('No access token received');
        }
        
        // Get user info from Google
        const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${tokens.access_token}` }
        });
        
        const googleUser = await userResponse.json();
        
        // Check if user exists
        let user = await User.findOne({ email: googleUser.email });
        
        if (!user) {
            // Create new user
            user = await User.create({
                name: googleUser.name,
                email: googleUser.email,
                googleId: googleUser.id,
                password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
            });
        }
        
        // Generate JWT token
        const token = generateToken(user._id);
        
        // Redirect to frontend with token
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/success?token=${token}&user=${encodeURIComponent(JSON.stringify({ id: user._id, name: user.name, email: user.email }))}`);
        
    } catch (error) {
        console.error('Google OAuth callback error:', error);
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=oauth_failed`);
    }
});

// @route   POST /api/auth/google
// @desc    Google OAuth login
// @access  Public
router.post('/google', async (req, res) => {
    try {
        const { token, name, email, googleId } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            // Create new user
            user = await User.create({
                name,
                email,
                googleId,
                password: Math.random().toString(36).slice(-8) // Random password
            });
        }

        res.json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            }
        });
    } catch (error) {
        console.error('Google auth error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during Google authentication'
        });
    }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

export default router;
