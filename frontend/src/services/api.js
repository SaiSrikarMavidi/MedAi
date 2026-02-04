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
  // Login with username/password
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },

  // Login with OTP
  requestOTP: async (mobile) => {
    const response = await api.post('/auth/request-otp', { mobile });
    return response.data;
  },

  verifyOTP: async (mobile, otp) => {
    const response = await api.post('/auth/verify-otp', { mobile, otp });
    return response.data;
  },

  // Google OAuth
  googleAuth: async (credential) => {
    const response = await api.post('/auth/google', { credential });
    return response.data;
  },

  // Register
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
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
    const response = await api.get('/chats');
    return response.data;
  },

  // Get specific chat
  getChat: async (chatId) => {
    const response = await api.get(`/chats/${chatId}`);
    return response.data;
  },

  // Create new chat
  createChat: async () => {
    const response = await api.post('/chats');
    return response.data;
  },

  // Send message
  sendMessage: async (chatId, message) => {
    const response = await api.post(`/chats/${chatId}/messages`, message);
    return response.data;
  },

  // Upload image/report
  uploadFile: async (chatId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/chats/${chatId}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Analyze health issue
  analyzeIssue: async (chatId, data) => {
    const response = await api.post(`/chats/${chatId}/analyze`, data);
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
    const response = await api.get('/food/search', { params: { query } });
    return response.data;
  },

  // Check food compatibility
  checkFood: async (foodName, healthConditions) => {
    const response = await api.post('/food/check', { foodName, healthConditions });
    return response.data;
  },

  // Get recommended foods
  getRecommendedFoods: async (healthConditions) => {
    const response = await api.get('/food/recommended', { params: { healthConditions } });
    return response.data;
  },

  // Get meal plan
  getMealPlan: async () => {
    const response = await api.get('/food/meal-plan');
    return response.data;
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
