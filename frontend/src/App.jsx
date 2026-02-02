import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ChatDashboard from './pages/ChatDashboard';
import Chatbot from './pages/Chatbot';
import DoctorConsultation from './pages/DoctorConsultation';
import MedicineReminder from './pages/MedicineReminder';
import FoodAdvisor from './pages/FoodAdvisor';
import HealthTracking from './pages/HealthTracking';
import MainLayout from './components/MainLayout';

function App() {
    // TODO: Implement proper authentication check
    const isAuthenticated = true; // Set to true for development

    const ProtectedRoute = ({ children, useMainLayout = true }) => {
        if (!isAuthenticated) return <Navigate to="/login" />;
        return useMainLayout ? <MainLayout>{children}</MainLayout> : children;
    };

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route
                    path="/dashboard"
                    element={<ProtectedRoute useMainLayout={false}><ChatDashboard /></ProtectedRoute>}
                />
                <Route
                    path="/chat/:chatId?"
                    element={<ProtectedRoute useMainLayout={false}><Chatbot /></ProtectedRoute>}
                />
                <Route
                    path="/doctors"
                    element={<ProtectedRoute useMainLayout={false}><DoctorConsultation /></ProtectedRoute>}
                />
                <Route
                    path="/reminders"
                    element={<ProtectedRoute useMainLayout={false}><MedicineReminder /></ProtectedRoute>}
                />
                <Route
                    path="/food"
                    element={<ProtectedRoute useMainLayout={false}><FoodAdvisor /></ProtectedRoute>}
                />
                <Route
                    path="/tracking"
                    element={<ProtectedRoute><HealthTracking /></ProtectedRoute>}
                />

                {/* Default Route */}
                <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
                <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
            </Routes>
        </Router>
    );
}

export default App;
