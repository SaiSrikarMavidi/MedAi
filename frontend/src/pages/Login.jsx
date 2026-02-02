import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Smartphone, ArrowRight, Heart } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Login = () => {
    const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'mobile'
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        mobile: '',
        otp: ''
    });
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        // TODO: Implement API call
        setTimeout(() => {
            setLoading(false);
            console.log('Email login:', formData);
        }, 1500);
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        // TODO: Implement OTP sending
        setTimeout(() => {
            setLoading(false);
            setShowOtpInput(true);
        }, 1500);
    };

    const handleOtpLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        // TODO: Implement OTP verification
        setTimeout(() => {
            setLoading(false);
            console.log('OTP login:', formData);
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
                    <h1 className="text-4xl font-semibold text-neutral-900 mb-2">MediAI</h1>
                    <p className="text-neutral-600">Intelligent Healthcare Platform</p>
                </div>

                {/* Login Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl shadow-xl border border-neutral-200 p-8"
                >
                    <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Welcome Back</h2>

                    {/* Login Method Toggle */}
                    <div className="flex gap-2 mb-6 p-1 bg-neutral-100 rounded-lg">
                        <button
                            onClick={() => setLoginMethod('email')}
                            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${loginMethod === 'email'
                                    ? 'bg-white text-primary-600 shadow-sm'
                                    : 'text-neutral-600 hover:text-neutral-900'
                                }`}
                        >
                            <Mail className="w-4 h-4 inline mr-2" />
                            Email
                        </button>
                        <button
                            onClick={() => setLoginMethod('mobile')}
                            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${loginMethod === 'mobile'
                                    ? 'bg-white text-primary-600 shadow-sm'
                                    : 'text-neutral-600 hover:text-neutral-900'
                                }`}
                        >
                            <Smartphone className="w-4 h-4 inline mr-2" />
                            Mobile
                        </button>
                    </div>

                    {/* Email Login Form */}
                    {loginMethod === 'email' && (
                        <motion.form
                            key="email-form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onSubmit={handleEmailLogin}
                            className="space-y-4"
                        >
                            <Input
                                label="Email Address"
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleInputChange}
                                icon={<Mail className="w-5 h-5" />}
                                required
                            />

                            <Input
                                label="Password"
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleInputChange}
                                icon={<Lock className="w-5 h-5" />}
                                required
                            />

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500" />
                                    <span className="text-neutral-600">Remember me</span>
                                </label>
                                <a href="/forgot-password" className="text-primary-600 hover:text-primary-700 font-medium">
                                    Forgot password?
                                </a>
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
                                Sign In
                            </Button>
                        </motion.form>
                    )}

                    {/* Mobile OTP Login Form */}
                    {loginMethod === 'mobile' && (
                        <motion.form
                            key="mobile-form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={showOtpInput ? handleOtpLogin : handleSendOtp}
                            className="space-y-4"
                        >
                            <Input
                                label="Mobile Number"
                                type="tel"
                                name="mobile"
                                placeholder="+1 (555) 000-0000"
                                value={formData.mobile}
                                onChange={handleInputChange}
                                icon={<Smartphone className="w-5 h-5" />}
                                disabled={showOtpInput}
                                required
                            />

                            {showOtpInput && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Input
                                        label="Enter OTP"
                                        type="text"
                                        name="otp"
                                        placeholder="000000"
                                        value={formData.otp}
                                        onChange={handleInputChange}
                                        icon={<Lock className="w-5 h-5" />}
                                        helperText="OTP sent to your mobile number"
                                        required
                                    />
                                </motion.div>
                            )}

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="w-full"
                                loading={loading}
                                icon={<ArrowRight className="w-5 h-5" />}
                                iconPosition="right"
                            >
                                {showOtpInput ? 'Verify OTP' : 'Send OTP'}
                            </Button>

                            {showOtpInput && (
                                <button
                                    type="button"
                                    onClick={() => setShowOtpInput(false)}
                                    className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium"
                                >
                                    Change mobile number
                                </button>
                            )}
                        </motion.form>
                    )}

                    {/* Register Link */}
                    <div className="mt-6 text-center">
                        <p className="text-neutral-600">
                            Don't have an account?{' '}
                            <a href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                                Sign up
                            </a>
                        </p>
                    </div>
                </motion.div>

                {/* Footer */}
                <p className="text-center text-sm text-neutral-500 mt-6">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
