# 🚀 MediAI - Quick Start Guide

This guide will help you get the MediAI project up and running in minutes!

## ⚡ Quick Setup (5 Minutes)

### Step 1: Prerequisites Check

Before starting, make sure you have:
- ✅ Node.js 18+ installed ([Download](https://nodejs.org/))
- ✅ Git installed
- ✅ A code editor (VS Code recommended)

### Step 2: Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd MedAi/frontend

# Install dependencies (this may take 2-3 minutes)
npm install
```

### Step 3: Environment Setup

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env file (optional for now - defaults work for local development)
```

The `.env` file contains:
```env
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
VITE_ENV=development
```

> **Note**: For initial testing, you can use the default values. Google OAuth and Maps will require API keys for full functionality.

### Step 4: Start Development Server

```bash
npm run dev
```

You should see:
```
  VITE v5.4.21  ready in 427 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### Step 5: Open Application

Open your browser and navigate to:
```
http://localhost:3000
```

You should see the **MediAI Login Page**! 🎉

---

## 🎯 Testing the Application

### Authentication Flow (Without Backend)

Currently, the frontend is set up with mock data for testing UI/UX:

1. **Login Page**
   - Go to `http://localhost:3000/login`
   - Enter any username and password
   - Click "Secure Login"
   - (Backend integration required for actual authentication)

2. **Chat Dashboard**
   - After login, you'll see the Chat Dashboard
   - View mock consultations
   - Click "Start New Consultation"

3. **AI Chatbot**
   - Navigate to the chatbot interface
   - See AI-powered health conversation UI
   - (AI integration requires backend)

4. **Other Features**
   - **Doctor Consultation**: Browse doctor consultation options
   - **Medicine Reminders**: View medicine scheduling interface
   - **Food Advisor**: Check food recommendations UI
   - **Health Tracking**: See health tracking dashboard

---

## 🔧 Project Structure Overview

```
frontend/
├── src/
│   ├── pages/              # All page components
│   │   ├── Login.jsx       # ← Start here
│   │   ├── ChatDashboard.jsx
│   │   ├── Chatbot.jsx
│   │   └── ...
│   ├── components/         # Reusable components
│   ├── context/            # State management
│   ├── services/           # API integration
│   └── App.jsx             # Main app router
└── package.json
```

---

## 🎨 Available Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/login` | Login | User authentication |
| `/register` | Register | New user signup |
| `/dashboard` | Chat Dashboard | View all consultations |
| `/chat` | AI Chatbot | Health issue analyzer |
| `/doctors` | Doctor Consultation | Find & book doctors |
| `/reminders` | Medicine Reminders | Medicine management |
| `/food` | Food Advisor | Food recommendations |
| `/tracking` | Health Tracking | Vitals & progress |

---

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check for linting issues (if configured)
npm run lint
```

---

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| `react` | UI framework |
| `react-router-dom` | Routing |
| `axios` | HTTP requests |
| `tailwindcss` | Styling |
| `framer-motion` | Animations |
| `lucide-react` | Icons |
| `recharts` | Charts & graphs |

---

## 🔗 API Integration

### Current Status
✅ **Frontend**: Fully implemented with UI/UX  
⏳ **Backend**: API integration layer ready (awaiting backend deployment)

### API Service Structure

All API calls are centralized in `src/services/api.js`:

```javascript
import { authAPI, chatAPI, doctorAPI, medicineAPI, foodAPI, healthAPI } from './services/api';

// Example: Login
const result = await authAPI.login(username, password);

// Example: Create chat
const chat = await chatAPI.createChat();

// Example: Search doctors
const doctors = await doctorAPI.searchDoctors({ specialization: 'Cardiologist' });
```

### Connecting to Backend

Once your backend is ready:

1. Update `VITE_API_URL` in `.env`:
```env
VITE_API_URL=https://your-backend-url.com
```

2. Ensure backend CORS allows `http://localhost:3000`

3. The frontend will automatically connect to your backend APIs

---

## 🎨 UI Features Showcase

### 1. **Modern Dark Theme**
- Sleek dark mode interface
- Professional medical aesthetic
- Smooth animations and transitions

### 2. **Responsive Design**
- Works on desktop, tablet, and mobile
- Adaptive navigation
- Touch-friendly interfaces

### 3. **Interactive Components**
- Real-time search and filtering
- Animated page transitions
- Loading states and error handling

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# If port 3000 is busy
# Kill the process or change port in vite.config.js
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Clear cache
npm run dev -- --force
```

---

## 📚 Next Steps

### For Frontend Developers
1. ✅ You're all set! Start exploring the UI
2. Customize components in `src/components/`
3. Modify pages in `src/pages/`
4. Update styling in Tailwind

### For Backend Developers
1. Set up FastAPI backend
2. Implement API endpoints (see README.md)
3. Connect MongoDB Atlas
4. Configure authentication
5. Update frontend `.env` with backend URL

### For Full-Stack Integration
1. Backend runs on `http://localhost:8000`
2. Frontend runs on `http://localhost:3000`
3. They communicate via API service layer
4. Test authentication flow end-to-end

---

## 🎉 Success Checklist

- [ ] Node.js installed
- [ ] Project cloned
- [ ] Dependencies installed
- [ ] Development server running
- [ ] Can access `http://localhost:3000`
- [ ] Can navigate between pages
- [ ] UI looks good and responsive

---

## 💡 Quick Tips

1. **Hot Reload**: Changes auto-refresh in browser
2. **Console**: Check browser console for errors (F12)
3. **Network**: Monitor API calls in Network tab (F12)
4. **React DevTools**: Install for component debugging

---

## 📞 Need Help?

- 📖 Check [README.md](README.md) for detailed documentation
- 🐛 Report issues on GitHub
- 💬 Ask questions in project discussions

---

## 🎯 What's Working Right Now

✅ **Fully Functional (Without Backend)**:
- Complete UI/UX for all pages
- Navigation between routes
- Form inputs and validation
- Responsive design
- Animations and interactions
- Mock data display

⏳ **Requires Backend Connection**:
- User authentication
- AI health analysis
- Doctor search (Google Maps)
- Medicine reminders (notifications)
- Health data persistence

---

**Happy Coding! 🚀**

Made with ❤️ by the MediAI Team
