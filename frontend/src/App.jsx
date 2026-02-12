import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthSuccess from './pages/AuthSuccess';
import ChatDashboard from './pages/ChatDashboard';

function ProtectedRoute({ children, useMainLayout = true }) {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    <p className="mt-4 text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }
    
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    return useMainLayout ? <MainLayout>{children}</MainLayout> : children;
}

function AppRoutes() {
    const { isAuthenticated } = useAuth();

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/auth/success" element={<AuthSuccess />} />

                {/* Protected Routes */}
                <Route
                    path="/dashboard"
                    element={<ProtectedRoute useMainLayout={false}><ChatDashboard /></ProtectedRoute>}
                />

                {/* Default Route */}
                <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
                <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
            </Routes>
        </Router>
    );
}

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
