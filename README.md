# 🏥 MediAI - AI-Powered Intelligent Healthcare & Wellness Platform

**A Full-Stack AI-Driven Platform for Health Issue Understanding, Smart Consultation, Digital Prescription, and Continuous Health Tracking**

![MediAI Platform](https://img.shields.io/badge/MediAI-Healthcare-blue) ![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react) ![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?logo=fastapi) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [User Workflows](#user-workflows)
- [Deployment](#deployment)

---

## 🎯 Overview

MediAI is an end-to-end intelligent healthcare ecosystem that guides users from **health issue identification** to **treatment** and **recovery tracking**. The platform combines Large Language Models (LLMs), Computer Vision, and cloud services to deliver personalized healthcare assistance.

### Problem Statement

Users face several healthcare challenges:
- ❌ Difficulty explaining symptoms accurately
- ❌ No instant reliable health guidance
- ❌ Uncertainty about doctor visit necessity
- ❌ Difficulty finding the right specialist nearby
- ❌ Poor medication adherence
- ❌ No unified recovery tracking system

### Our Solution

MediAI provides:
- ✅ Multimodal health issue input (text + images)
- ✅ AI-powered health analysis
- ✅ Smart treatment path decision
- ✅ Location-based doctor discovery
- ✅ Digital prescriptions
- ✅ Automated medicine reminders
- ✅ Daily health progress tracking

---

## ✨ Features

### 1. **User Authentication & Security**
- 🔐 Password-based login
- 📱 Mobile OTP authentication
- 🌐 Google OAuth integration
- 🔒 JWT token-based security
- 🛡️ HIPAA-compliant data handling

### 2. **AI Health Chatbot** (Core Feature)
- 💬 Natural language symptom description
- 📸 Image upload for skin issues/reports
- 📄 Medical document analysis (PDF/Images)
- 🤖 AI-powered health assessment
- 🎯 Automatic treatment path suggestion

### 3. **Smart Treatment Decision Engine**
Three AI-determined paths:
- **Self-Care**: Home remedies, lifestyle guidance
- **Online Consultation**: Video/audio/text with doctors
- **Physical Consultation**: Nearby doctor mapping & booking

### 4. **Doctor Consultation**
- 🔍 Specialization-based doctor mapping
- 📍 Location-based doctor discovery (Google Maps API)
- 📹 Video consultation (WebRTC/Google Meet)
- 📞 Audio consultation
- 💬 Text-based chat consultation
- 📋 AI-generated case summaries for doctors

### 5. **Digital Prescription**
- 💊 Digital prescription generation
- 📦 Medicine ordering links
- 📚 Prescription history
- 🔄 Automatic medicine reminder setup

### 6. **Medicine Reminder System**
- ⏰ Smart scheduling (morning/afternoon/evening/night)
- 📧 Email/SMS/Push notifications
- ✅ Taken/Missed dose tracking
- 📊 Adherence analytics

### 7. **Food Advisor**
- 🍎 Condition-aware food recommendations
- 🔍 Food search & compatibility check
- ✅ Allowed/Limited/Avoid status
- 🥗 Personalized meal plans
- 📈 Nutritional insights

### 8. **Health Tracking**
- 📊 Daily symptom logging
- 💓 Vitals tracking (BP, sugar, weight, etc.)
- 📈 Progress visualization (charts & graphs)
- 🎯 Recovery goal monitoring
- 📅 Historical health data

### 9. **Chat Dashboard**
- 💬 View all past consultations
- ▶️ Resume in-progress sessions
- 🆕 Start new consultations
- 🔍 Search consultations by symptoms/date

---

## 🛠️ Technology Stack

### **Frontend (Web)**
```
├── React.js 18.3             # UI framework
├── Tailwind CSS              # Styling
├── Vite                      # Build tool
├── React Router DOM          # Navigation
├── Axios                     # HTTP client
├── Framer Motion             # Animations
├── Lucide React              # Icons
├── Recharts                  # Data visualization
└── date-fns                  # Date utilities
```

### **Backend**
```
├── FastAPI (Python)          # REST API framework
├── JWT Authentication        # Secure auth
├── Google OAuth              # Social login
└── Twilio/SendGrid           # Notifications
```

### **Database & Storage**
```
├── MongoDB Atlas             # Primary database
└── AWS S3                    # Medical images & reports
```

### **AI/ML Services**
```
├── OpenAI / HuggingFace LLMs # Text understanding
├── LangChain + RAG           # Medical knowledge retrieval
├── FAISS / Chroma            # Vector database
├── PyTorch / Vision Models   # Image analysis
└── Scikit-learn              # Health analytics
```

### **Additional Services**
```
├── Google Maps API           # Doctor discovery
├── Google Meet / WebRTC      # Video consultations
└── Twilio / SendGrid         # SMS/Email notifications
```

### **Deployment**
```
├── Vercel                    # Frontend hosting
├── Render                    # Backend APIs
└── Streamlit Cloud           # AI services
```

---

## 🏗️ System Architecture

```
User (Browser)
      │
      ├─── Google OAuth + JWT Authentication
      │
Frontend (React + Vite)
      │
      ├─── API Layer (Axios)
      │
Backend (FastAPI)
      │
      ├────┬────────┬──────────┬───────────┐
      │    │        │          │           │
 MongoDB  AWS S3   AI/ML    Maps API   Video API
      │    │      Services     │           │
      │    │        │          │           │
   Users  Files   LLM+RAG   Doctors   Consultations
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.9+ (for backend)
- MongoDB Atlas account
- Google Cloud Console account (OAuth, Maps API)
- AWS account (S3 bucket)

### Frontend Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd MedAi/frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` file:
```env
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
VITE_ENV=development
```

4. **Start development server**
```bash
npm run dev
```

The application will run at: `http://localhost:3000`

---

## 📁 Project Structure

```
MedAi/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.jsx          # Side navigation
│   │   │   ├── MainLayout.jsx          # Main app layout
│   │   │   ├── ChatLayout.jsx          # Chat page layout
│   │   │   ├── DashboardLayout.jsx     # Dashboard layout
│   │   │   └── ui/                     # UI components
│   │   ├── pages/
│   │   │   ├── Login.jsx               # Login page
│   │   │   ├── Register.jsx            # Registration page
│   │   │   ├── ChatDashboard.jsx       # Post-login dashboard
│   │   │   ├── Chatbot.jsx             # AI chatbot interface
│   │   │   ├── DoctorConsultation.jsx  # Doctor search & booking
│   │   │   ├── MedicineReminder.jsx    # Medicine management
│   │   │   ├── FoodAdvisor.jsx         # Food recommendations
│   │   │   └── HealthTracking.jsx      # Health logs & vitals
│   │   ├── context/
│   │   │   └── AuthContext.jsx         # Auth state management
│   │   ├── services/
│   │   │   └── api.js                  # API integration
│   │   ├── App.jsx                     # Root component
│   │   └── main.jsx                    # App entry point
│   └── package.json
│
└── README.md                           # This file
```

---

## 👤 User Workflows

### **Complete User Journey**

```
1. Login (Password/OTP/Google OAuth)
         ↓
2. Chat Dashboard
   ├─ View existing chats
   └─ Start new consultation
         ↓
3. AI Health Chatbot
   ├─ Enter symptoms (text)
   ├─ Upload images/reports
   └─ AI analyzes input
         ↓
4. Treatment Decision
   ├─ Case 1: Self-Care
   │   ├─ Home remedies
   │   └─ Health tracking
   │
   ├─ Case 2: Online Consultation
   │   ├─ Video/Audio/Text with doctor
   │   ├─ Digital prescription
   │   ├─ Medicine reminders
   │   └─ Health tracking
   │
   └─ Case 3: Physical Consultation
       ├─ Nearby doctor mapping
       ├─ Appointment booking
       ├─ Clinic visit
       ├─ Prescription
       └─ Reminders + tracking
```

---

## 🚢 Deployment

### **Frontend Deployment (Vercel)**

1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy

### **Database (MongoDB Atlas)**

1. Create cluster on MongoDB Atlas
2. Configure network access
3. Create database user
4. Get connection string
5. Update backend `.env`

---

## 🔮 Future Enhancements

- 🎙️ Voice-based health assistant
- 🌍 Multilingual support
- ⌚ Wearable device integration
- 💳 Insurance integration
- 🔗 Blockchain medical records
- 🤖 Advanced AI diagnostics
- 📱 Mobile app (React Native)

---

Made with ❤️ by the MediAI Team

---

## 🚦 Project Status

🟢 **Active Development** - Frontend implementation complete

Current Version: `1.0.0-beta`  
Last Updated: February 2026

