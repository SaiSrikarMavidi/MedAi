# MediAI - AI-Powered Intelligent Healthcare Platform

An intelligent healthcare web application that enables users to receive AI-driven health analysis, connect with doctors, manage prescriptions, and track health recovery.

## 🎨 Design Philosophy

MediAI follows **Swiss Design** principles:
- **Minimalist & Clean**: Focused on content with minimal distractions
- **Grid-Based Layout**: Structured 8px grid system for consistency
- **High Contrast**: Clear typography and color hierarchy
- **Interactive Gestures**: Smooth animations and micro-interactions
- **Typography**: Inter font family for modern, readable text

## ✨ Features

### 🔐 Authentication
- Email/Password login
- Mobile OTP verification
- Password reset functionality
- Session management

### 💬 AI Health Chatbot
- Text-based symptom input
- Medical image/PDF upload
- AI-powered health analysis
- Risk level assessment
- Treatment recommendations

### 👨‍⚕️ Doctor Consultation
- Search doctors by specialization
- Filter by availability and location
- Video, voice, and chat consultations
- View doctor ratings and reviews
- Book appointments

### 💊 Medicine Reminders
- Automated reminder scheduling
- Dose tracking (taken/missed)
- Weekly adherence overview
- In-app notifications

### 🍎 Food Advisor
- Food compatibility checker
- Nutritional analysis
- Safe portion recommendations
- Health-based restrictions
- Alternative suggestions

### 📊 Health Tracking
- Daily metrics logging (BP, sugar, weight, sleep)
- Interactive progress charts
- AI-powered recovery insights
- Trend visualization

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **Axios** - HTTP client

### Backend (Planned)
- **FastAPI** - Python web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **OpenAI/HuggingFace** - LLM integration
- **LangChain** - RAG implementation
- **AWS S3** - File storage

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd MedAi
\`\`\`

2. Install frontend dependencies:
\`\`\`bash
cd frontend
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open your browser and navigate to:
\`\`\`
http://localhost:3000
\`\`\`

## 📁 Project Structure

\`\`\`
MedAi/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/          # Reusable UI components
│   │   │   ├── Navigation.jsx
│   │   │   └── MainLayout.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ChatDashboard.jsx
│   │   │   ├── Chatbot.jsx
│   │   │   ├── DoctorConsultation.jsx
│   │   │   ├── MedicineReminder.jsx
│   │   │   ├── FoodAdvisor.jsx
│   │   │   └── HealthTracking.jsx
│   │   ├── styles/
│   │   │   └── index.css    # Global styles & design system
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── backend/                  # To be implemented
\`\`\`

## 🎯 Current Status

### ✅ Completed
- Swiss design system with TailwindCSS
- All major UI pages and components
- Interactive animations with Framer Motion
- Responsive navigation (desktop + mobile)
- Form validation and error handling
- File upload with preview
- Chart visualizations

### 🚧 In Progress
- Backend API development
- AI/LLM integration
- Real-time notifications
- Video consultation integration

### 📋 Planned
- MongoDB integration
- JWT authentication backend
- RAG-based medical knowledge retrieval
- Production deployment
- Mobile app (React Native)

## 🎨 Design Tokens

### Colors
- **Primary**: Blue (#0ea5e9)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)
- **Neutral**: Gray scale

### Typography
- **Font Family**: Inter
- **Sizes**: 12px - 48px (responsive)
- **Weights**: 300, 400, 500, 600, 700

### Spacing
- **Base Unit**: 8px
- **Grid System**: 4, 8, 12, 16, 24, 32, 48, 64px

## 📝 License

This project is for educational and demonstration purposes.

## ⚠️ Disclaimer

MediAI provides health guidance and assistance only. It does **not** replace professional medical diagnosis, treatment, or emergency services. Always consult with qualified healthcare professionals for medical advice.

## 🤝 Contributing

This is a demonstration project. For production use, additional security, testing, and compliance measures would be required.

---

**Built with ❤️ using Swiss Design Principles**
