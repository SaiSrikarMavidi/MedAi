# MediAI Backend API

Complete Node.js + Express + MongoDB backend for the MediAI healthcare platform.

## Setup Instructions

### 1. Install MongoDB
```bash
# Download and install MongoDB Community Server
# https://www.mongodb.com/try/download/community
```

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Configure Environment
```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env and add your API keys (optional)
```

### 4. Start MongoDB
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
```

### 5. Start Backend Server
```bash
npm run dev
```

Server will run on: **http://localhost:8000**

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/request-otp` - Request OTP
- `POST /api/auth/verify-otp` - Verify OTP and login
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/me` - Get current user (protected)

### Chat
- `GET /api/chat` - Get all user chats
- `GET /api/chat/:id` - Get single chat
- `POST /api/chat` - Create new chat
- `POST /api/chat/:id/messages` - Send message
- `POST /api/chat/analyze` - Analyze health issue

### Doctors
- `GET /api/doctors/search` - Search doctors
- `GET /api/doctors/nearby` - Get nearby doctors
- `POST /api/doctors/:id/book` - Book appointment

### Medicines
- `GET /api/medicines` - Get user medicines
- `POST /api/medicines` - Add medicine
- `PUT /api/medicines/:id/mark-taken` - Mark as taken
- `DELETE /api/medicines/:id` - Delete medicine

### Food
- `GET /api/food/search` - Search foods
- `POST /api/food/check` - Check food safety
- `GET /api/food/recommendations` - Get recommendations

### Health Tracking
- `GET /api/health/logs` - Get health logs
- `POST /api/health/logs` - Add health log
- `GET /api/health/trends` - Get health trends

## Database Models

- **User**: Authentication, profile, medical history
- **Chat**: Consultations with AI messages
- **Medicine**: Medicine reminders and tracking
- **HealthLog**: Daily vitals and health metrics

## Features Implemented

✅ User authentication (password + OTP + Google OAuth)
✅ JWT token-based authorization
✅ AI chatbot with OpenAI integration (optional)
✅ Health tracking with vitals
✅ Medicine reminder system
✅ Food advisor with safety checks
✅ Doctor search and booking (mock data)
✅ MongoDB database with Mongoose ODM
✅ Input validation
✅ Error handling middleware
✅ CORS enabled for frontend

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + bcrypt
- **AI**: OpenAI API (optional)
- **Validation**: express-validator

## Development

```bash
npm run dev  # Start with nodemon (auto-reload)
npm start    # Production mode
```

## Environment Variables

Required:
- `PORT` - Server port (default: 8000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens

Optional:
- `OPENAI_API_KEY` - For AI chatbot features
- `GOOGLE_CLIENT_ID` - For Google OAuth
- `EMAIL_USER/EMAIL_PASS` - For OTP emails

## Notes

- MongoDB must be running before starting the server
- Some features work with mock data (doctors, food)
- OpenAI API key is optional - app works without it
- Frontend should run on port 3000
