import axios from 'axios';

// API Base URL - Update this to your backend URL when deployed
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  // Login with email/password
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  // Login with OTP
  requestOTP: async (mobile) => {
    const response = await api.post('/api/auth/request-otp', { mobile });
    return response.data;
  },

  verifyOTP: async (mobile, otp) => {
    const response = await api.post('/api/auth/verify-otp', { mobile, otp });
    return response.data;
  },

  // Google OAuth
  googleAuth: async (credential) => {
    const response = await api.post('/api/auth/google', { credential });
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    return response.data;
  },
};

// Chat APIs
export const chatAPI = {
  // Get all chats for user
  getChats: async () => {
    const response = await api.get('/api/chat');
    return response.data;
  },

  // Get specific chat
  getChat: async (chatId) => {
    const response = await api.get(`/api/chat/${chatId}`);
    return response.data;
  },

  // Create new chat
  createChat: async () => {
    const response = await api.post('/api/chat');
    return response.data;
  },

  // Send simple message to LLM (simple chatbot UI)
  // Backend maintains short conversation history per user.
  sendSimpleMessage: async (message) => {
    const response = await api.post('/api/chat', { message });
    return response.data;
  },

  // Send message
  sendMessage: async (chatId, message) => {
    const response = await api.post(`/api/chat/${chatId}/messages`, message);
    return response.data;
  },

  // Upload image/report
  uploadFile: async (chatId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/api/chat/${chatId}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Analyze health issue
  analyzeIssue: async (chatId, data) => {
    const response = await api.post(`/api/chat/${chatId}/analyze`, data);
    return response.data;
  },
};

// Doctor APIs
export const doctorAPI = {
  // Search doctors by location and specialization
  searchDoctors: async (params) => {
    const response = await api.get('/doctors/search', { params });
    return response.data;
  },

  // Get nearby doctors
  getNearbyDoctors: async (latitude, longitude, specialization) => {
    const response = await api.get('/doctors/nearby', {
      params: { latitude, longitude, specialization },
    });
    return response.data;
  },

  // Get doctor details
  getDoctor: async (doctorId) => {
    const response = await api.get(`/doctors/${doctorId}`);
    return response.data;
  },

  // Book appointment
  bookAppointment: async (appointmentData) => {
    const response = await api.post('/appointments/book', appointmentData);
    return response.data;
  },

  // Start video consultation
  startVideoConsultation: async (appointmentId) => {
    const response = await api.post(`/appointments/${appointmentId}/video`);
    return response.data;
  },

  // Get appointments
  getAppointments: async () => {
    const response = await api.get('/appointments');
    return response.data;
  },
};

// Prescription APIs
export const prescriptionAPI = {
  // Get all prescriptions
  getPrescriptions: async () => {
    const response = await api.get('/prescriptions');
    return response.data;
  },

  // Get specific prescription
  getPrescription: async (prescriptionId) => {
    const response = await api.get(`/prescriptions/${prescriptionId}`);
    return response.data;
  },

  // Add medicine from prescription
  addMedicineFromPrescription: async (prescriptionId) => {
    const response = await api.post(`/prescriptions/${prescriptionId}/add-medicines`);
    return response.data;
  },
};

// Medicine Reminder APIs
export const medicineAPI = {
  // Get all medicines
  getMedicines: async () => {
    const response = await api.get('/medicines');
    return response.data;
  },

  // Add medicine
  addMedicine: async (medicineData) => {
    const response = await api.post('/medicines', medicineData);
    return response.data;
  },

  // Update medicine
  updateMedicine: async (medicineId, medicineData) => {
    const response = await api.put(`/medicines/${medicineId}`, medicineData);
    return response.data;
  },

  // Delete medicine
  deleteMedicine: async (medicineId) => {
    const response = await api.delete(`/medicines/${medicineId}`);
    return response.data;
  },

  // Mark medicine as taken
  markAsTaken: async (medicineId, timestamp) => {
    const response = await api.post(`/medicines/${medicineId}/taken`, { timestamp });
    return response.data;
  },

  // Get reminders for today
  getTodayReminders: async () => {
    const response = await api.get('/medicines/reminders/today');
    return response.data;
  },
};

// Food Advisor APIs
export const foodAPI = {
  // Search food
  searchFood: async (query) => {
    try {
      const response = await api.get('/api/food/search', { params: { query } });
      return response.data;
    } catch (error) {
      console.error('Search food error:', error);
      // Return fallback data if API fails
      return {
        success: true,
        data: {
          safe: [
            { name: 'Brown Rice', category: 'Grains', calories: 216, protein: 5, carbs: 45, fat: 2 },
            { name: 'Grilled Chicken', category: 'Protein', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
            { name: 'Steamed Broccoli', category: 'Vegetables', calories: 55, protein: 4, carbs: 11, fat: 0.6 }
          ],
          limit: [
            { name: 'White Bread', category: 'Grains', calories: 265, protein: 9, carbs: 49, fat: 3.2 },
            { name: 'Processed Foods', category: 'Packaged', calories: 300, protein: 8, carbs: 35, fat: 12 }
          ],
          avoid: [
            { name: 'Fried Foods', category: 'Fast Food', calories: 320, protein: 24, carbs: 16, fat: 17 },
            { name: 'Sugary Drinks', category: 'Beverages', calories: 140, protein: 0, carbs: 39, fat: 0 }
          ]
        }
      };
    }
  },

  // Check food compatibility
  checkFood: async (foodName, healthConditions) => {
    try {
      const response = await api.post('/api/food/check', { foodName, healthConditions });
      return response.data;
    } catch (error) {
      console.error('Check food error:', error);
      // Return fallback safe response if API fails
      return {
        success: true,
        data: {
          safe: true,
          recommendation: 'Generally safe to consume. Please consult your healthcare provider for personalized advice.',
          alternatives: []
        }
      };
    }
  },

  // Get recommended foods
  getRecommendedFoods: async (healthConditions) => {
    try {
      const response = await api.get('/api/food/recommended', { params: { healthConditions } });
      return response.data;
    } catch (error) {
      console.error('Get recommended foods error:', error);
      // Return fallback recommendations if API fails
      return {
        success: true,
        data: {
          breakfast: [
            { name: 'Oatmeal', category: 'Grains', calories: 150, protein: 5, carbs: 27, fat: 3 },
            { name: 'Greek Yogurt', category: 'Dairy', calories: 100, protein: 17, carbs: 6, fat: 0 }
          ],
          lunch: [
            { name: 'Quinoa Salad', category: 'Grains', calories: 220, protein: 8, carbs: 39, fat: 4 },
            { name: 'Grilled Fish', category: 'Protein', calories: 180, protein: 25, carbs: 0, fat: 8 }
          ],
          dinner: [
            { name: 'Roasted Vegetables', category: 'Vegetables', calories: 85, protein: 3, carbs: 18, fat: 1 },
            { name: 'Lean Turkey', category: 'Protein', calories: 140, protein: 29, carbs: 0, fat: 3 }
          ]
        }
      };
    }
  },

  // Get meal plan
  getMealPlan: async () => {
    try {
      const response = await api.get('/api/food/meal-plan');
      return response.data;
    } catch (error) {
      console.error('Get meal plan error:', error);
      // Return fallback meal plan if API fails
      return {
        success: true,
        data: {
          breakfast: [
            { name: 'Whole grain toast with avocado', calories: 180 },
            { name: 'Fresh fruit bowl', calories: 90 },
            { name: 'Green tea', calories: 5 }
          ],
          lunch: [
            { name: 'Mediterranean salad', calories: 250 },
            { name: 'Grilled chicken breast', calories: 165 },
            { name: 'Water with lemon', calories: 5 }
          ],
          dinner: [
            { name: 'Baked sweet potato', calories: 112 },
            { name: 'Steamed fish fillet', calories: 140 },
            { name: 'Green beans', calories: 35 }
          ],
          snack: [
            { name: 'Handful of almonds', calories: 160 },
            { name: 'Herbal tea', calories: 2 }
          ]
        }
      };
    }
  },
};

// Health Tracking APIs
export const healthAPI = {
  // Get health logs
  getHealthLogs: async (startDate, endDate) => {
    const response = await api.get('/health/logs', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  // Add health log
  addHealthLog: async (logData) => {
    const response = await api.post('/health/logs', logData);
    return response.data;
  },

  // Update health log
  updateHealthLog: async (logId, logData) => {
    const response = await api.put(`/health/logs/${logId}`, logData);
    return response.data;
  },

  // Get health trends
  getHealthTrends: async (metric, period) => {
    const response = await api.get('/health/trends', {
      params: { metric, period },
    });
    return response.data;
  },

  // Get vitals summary
  getVitalsSummary: async () => {
    const response = await api.get('/health/vitals/summary');
    return response.data;
  },
};

export default api;
