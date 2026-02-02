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

    const ProtectedRoute = ({ children }) => {
        return isAuthenticated ? <MainLayout>{children}</MainLayout> : <Navigate to="/login" />;
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
                    element={<ProtectedRoute><ChatDashboard /></ProtectedRoute>}
                />
                <Route
                    path="/chat/:chatId?"
                    element={<ProtectedRoute><Chatbot /></ProtectedRoute>}
                />
                <Route
                    path="/doctors"
                    element={<ProtectedRoute><DoctorConsultation /></ProtectedRoute>}
                />
                <Route
                    path="/reminders"
                    element={<ProtectedRoute><MedicineReminder /></ProtectedRoute>}
                />
                <Route
                    path="/food"
                    element={<ProtectedRoute><FoodAdvisor /></ProtectedRoute>}
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
