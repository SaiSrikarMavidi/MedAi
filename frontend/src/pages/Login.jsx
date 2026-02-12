import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, Smartphone, LogIn, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import AuthLayout from '../components/ui/AuthLayout';

export default function Login() {
  const navigate = useNavigate();
  const { login, loginWithOTP, loginWithGoogle } = useAuth();
  
  const [activeTab, setActiveTab] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    mobile: '',
    otp: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');
    
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleRequestOTP = async () => {
    if (!formData.mobile) {
      setError('Please enter your mobile number');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await authAPI.requestOTP(formData.mobile);
      setOtpSent(true);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    }
    setLoading(false);
  };

  const handleOTPLogin = async (e) => {
    e.preventDefault();
    if (!formData.mobile || !formData.otp) {
      setError('Please enter both mobile number and OTP');
      return;
    }

    setLoading(true);
    setError('');
    
    const result = await loginWithOTP(formData.mobile, formData.otp);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async (response) => {
    setLoading(true);
    setError('');
    
    const result = await loginWithGoogle(response.credential);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-[420px] flex flex-col gap-8">
        {/* Page Heading */}
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold leading-tight tracking-tight">Welcome Back</h2>
          <p className="text-gray-500 dark:text-muted text-sm font-normal">
            Please sign in to access your secure dashboard.
          </p>
        </div>

        {/* Tabs */}
        <div className="w-full">
          <div className="flex border-b border-gray-200 dark:border-surface-border">
            <button
              onClick={() => setActiveTab('password')}
              className={`flex flex-1 items-center justify-center gap-2 border-b-[3px] pb-3 pt-2 text-sm font-bold tracking-wide transition-colors focus:outline-none ${
                activeTab === 'password'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 dark:text-muted hover:text-gray-700 dark:hover:text-white'
              }`}
            >
              <Lock className="w-5 h-5" />
              <span>Password</span>
            </button>
            <button
              onClick={() => setActiveTab('otp')}
              className={`flex flex-1 items-center justify-center gap-2 border-b-[3px] pb-3 pt-2 text-sm font-bold tracking-wide transition-colors focus:outline-none ${
                activeTab === 'otp'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 dark:text-muted hover:text-gray-700 dark:hover:text-white'
              }`}
            >
              <Smartphone className="w-5 h-5" />
              <span>OTP</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form className="flex flex-col gap-5" onSubmit={activeTab === 'password' ? handlePasswordLogin : handleOTPLogin}>
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Email/Mobile Field */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" htmlFor={activeTab === 'password' ? 'email' : 'mobile'}>
              {activeTab === 'password' ? 'Email' : 'Mobile Number'}
            </label>
            <div className="relative flex items-center">
              {activeTab === 'password' ? (
                <User className="absolute left-4 w-5 h-5 text-gray-400 dark:text-muted" />
              ) : (
                <Smartphone className="absolute left-4 w-5 h-5 text-gray-400 dark:text-muted" />
              )}
              <input
                id={activeTab === 'password' ? 'email' : 'mobile'}
                name={activeTab === 'password' ? 'email' : 'mobile'}
                type={activeTab === 'password' ? 'email' : 'tel'}
                placeholder={activeTab === 'password' ? 'Enter your email address' : 'Enter your mobile number'}
                value={activeTab === 'password' ? formData.email : formData.mobile}
                onChange={handleInputChange}
                disabled={otpSent && activeTab === 'otp'}
                className="flex w-full h-12 rounded-lg border border-gray-300 dark:border-surface-border bg-white dark:bg-surface-dark px-11 py-3 text-base placeholder:text-gray-400 dark:placeholder:text-muted focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password Field */}
          {activeTab === 'password' && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium" htmlFor="password">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 w-5 h-5 text-gray-400 dark:text-muted" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="flex w-full h-12 rounded-lg border border-gray-300 dark:border-surface-border bg-white dark:bg-surface-dark px-11 py-3 text-base placeholder:text-gray-400 dark:placeholder:text-muted focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-gray-400 dark:text-muted hover:text-gray-600 dark:hover:text-white focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}

          {/* OTP Field */}
          {activeTab === 'otp' && otpSent && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium" htmlFor="otp">
                One-Time Password
              </label>
              <div className="relative flex items-center">
                <ShieldCheck className="absolute left-4 w-5 h-5 text-gray-400 dark:text-muted" />
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  placeholder="Enter OTP sent to your phone"
                  value={formData.otp}
                  onChange={handleInputChange}
                  maxLength="6"
                  className="flex w-full h-12 rounded-lg border border-gray-300 dark:border-surface-border bg-white dark:bg-surface-dark px-11 py-3 text-base placeholder:text-gray-400 dark:placeholder:text-muted focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-muted">
                Didn't receive OTP?{' '}
                <button
                  type="button"
                  onClick={handleRequestOTP}
                  className="text-primary hover:underline"
                >
                  Resend
                </button>
              </p>
            </div>
          )}

          {/* Remember & Forgot Password */}
          {activeTab === 'password' && (
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-surface-border dark:bg-surface-dark"
                />
                <span className="text-sm text-gray-500 dark:text-muted">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-primary hover:text-blue-400 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          )}

          {/* Submit Button */}
          {activeTab === 'otp' && !otpSent ? (
            <button
              type="button"
              onClick={handleRequestOTP}
              disabled={loading}
              className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 text-white font-bold tracking-wide hover:bg-blue-600 focus:ring-4 focus:ring-blue-500/30 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Sending OTP...
                </>
              ) : (
                <>
                  <Smartphone className="w-5 h-5" />
                  Send OTP
                </>
              )}
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 text-white font-bold tracking-wide hover:bg-blue-600 focus:ring-4 focus:ring-blue-500/30 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Secure Login
                </>
              )}
            </button>
          )}
        </form>

        {/* Footer */}
        <div className="flex flex-col items-center gap-6 mt-4">
          {/* Divider */}
          <div className="relative w-full flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-surface-border" />
            </div>
            <span className="relative z-10 bg-background-light dark:bg-background-dark px-4 text-sm text-gray-500 dark:text-muted">
              Or
            </span>
          </div>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={() => {
              window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth/google`;
            }}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-lg border-2 border-gray-300 dark:border-surface-border bg-white dark:bg-surface-dark px-6 text-gray-700 dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-surface focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Sign Up Link */}
          <p className="text-sm text-gray-500 dark:text-muted">
            New to MediAI?
            <Link to="/register" className="font-bold text-primary hover:text-blue-400 hover:underline ml-1">
              Create an account
            </Link>
          </p>

          {/* Security Badges */}
          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 mt-4">
            <ShieldCheck className="w-4 h-4" />
            <span>HIPAA Compliant Platform</span>
            <span className="mx-1">•</span>
            <span>AES-256 Encryption</span>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
