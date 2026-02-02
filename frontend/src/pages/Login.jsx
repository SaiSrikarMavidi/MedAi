import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, Smartphone, LogIn, ShieldCheck } from 'lucide-react';
import AuthLayout from '../components/ui/AuthLayout';

export default function Login() {
  const [activeTab, setActiveTab] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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
        <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
          {/* Username Field */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" htmlFor="username">
              Username or Email
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-4 w-5 h-5 text-gray-400 dark:text-muted" />
              <input
                id="username"
                type="text"
                placeholder="Enter your username or email"
                className="flex w-full h-12 rounded-lg border border-gray-300 dark:border-surface-border bg-white dark:bg-surface-dark px-11 py-3 text-base placeholder:text-gray-400 dark:placeholder:text-muted focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
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
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
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
          {activeTab === 'otp' && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium" htmlFor="otp">
                One-Time Password
              </label>
              <div className="relative flex items-center">
                <Smartphone className="absolute left-4 w-5 h-5 text-gray-400 dark:text-muted" />
                <input
                  id="otp"
                  type="text"
                  placeholder="Enter OTP sent to your phone"
                  className="flex w-full h-12 rounded-lg border border-gray-300 dark:border-surface-border bg-white dark:bg-surface-dark px-11 py-3 text-base placeholder:text-gray-400 dark:placeholder:text-muted focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                />
              </div>
            </div>
          )}

          {/* Remember & Forgot Password */}
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

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 text-white font-bold tracking-wide hover:bg-blue-600 focus:ring-4 focus:ring-blue-500/30 transition-all shadow-lg shadow-blue-500/20"
          >
            <LogIn className="w-5 h-5" />
            Secure Login
          </button>
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
