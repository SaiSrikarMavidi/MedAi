import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Smartphone, ArrowRight, Heart } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user starts typing
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.mobile.trim()) {
            newErrors.mobile = 'Mobile number is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        // TODO: Implement API call
        setTimeout(() => {
            setLoading(false);
            console.log('Register:', formData);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-neutral-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                {/* Logo and Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                        className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4 shadow-lg"
                    >
                        <Heart className="w-8 h-8 text-white" fill="white" />
                    </motion.div>
                    <h1 className="text-4xl font-semibold text-neutral-900 mb-2">Create Account</h1>
                    <p className="text-neutral-600">Join MediAI for intelligent healthcare</p>
                </div>

                {/* Register Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl shadow-xl border border-neutral-200 p-8"
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Full Name"
                            type="text"
                            name="fullName"
                            placeholder="John Doe"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            icon={<User className="w-5 h-5" />}
                            error={errors.fullName}
                            required
                        />

                        <Input
                            label="Email Address"
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            icon={<Mail className="w-5 h-5" />}
                            error={errors.email}
                            required
                        />

                        <Input
                            label="Mobile Number"
                            type="tel"
                            name="mobile"
                            placeholder="+1 (555) 000-0000"
                            value={formData.mobile}
                            onChange={handleInputChange}
                            icon={<Smartphone className="w-5 h-5" />}
                            error={errors.mobile}
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            placeholder="Create a strong password"
                            value={formData.password}
                            onChange={handleInputChange}
                            icon={<Lock className="w-5 h-5" />}
                            error={errors.password}
                            helperText="Must be at least 8 characters"
                            required
                        />

                        <Input
                            label="Confirm Password"
                            type="password"
                            name="confirmPassword"
                            placeholder="Re-enter your password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            icon={<Lock className="w-5 h-5" />}
                            error={errors.confirmPassword}
                            required
                        />

                        <div className="pt-2">
                            <label className="flex items-start gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="mt-1 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                                    required
                                />
                                <span className="text-sm text-neutral-600">
                                    I agree to the{' '}
                                    <a href="/terms" className="text-primary-600 hover:text-primary-700 font-medium">
                                        Terms of Service
                                    </a>{' '}
                                    and{' '}
                                    <a href="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">
                                        Privacy Policy
                                    </a>
                                </span>
                            </label>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-full"
                            loading={loading}
                            icon={<ArrowRight className="w-5 h-5" />}
                            iconPosition="right"
                        >
                            Create Account
                        </Button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-neutral-600">
                            Already have an account?{' '}
                            <a href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                                Sign in
                            </a>
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Register;
