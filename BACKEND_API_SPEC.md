# 🔧 MediAI Backend API Specification

This document provides complete API specifications for backend developers to implement the MediAI server.

---

## 📋 Table of Contents

1. [Base Configuration](#base-configuration)
2. [Authentication APIs](#authentication-apis)
3. [Chat APIs](#chat-apis)
4. [Doctor APIs](#doctor-apis)
5. [Prescription APIs](#prescription-apis)
6. [Medicine APIs](#medicine-apis)
7. [Food APIs](#food-apis)
8. [Health Tracking APIs](#health-tracking-apis)
9. [Database Schema](#database-schema)
10. [Error Handling](#error-handling)

---

## 🌐 Base Configuration

### Server Details
```
Base URL: http://localhost:8000 (development)
Framework: FastAPI (Python)
Database: MongoDB Atlas
Authentication: JWT Tokens
```

### CORS Configuration
```python
CORS_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://your-frontend-domain.com"
]
```

### Headers
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

---

## 🔐 Authentication APIs

### 1. Login with Username/Password

**Endpoint**: `POST /auth/login`

**Request Body**:
```json
{
  "username": "string",
  "password": "string"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient"
  }
}
```

**Error Response** (401):
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### 2. Request OTP

**Endpoint**: `POST /auth/request-otp`

**Request Body**:
```json
{
  "mobile": "+1234567890"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "expiresIn": 300
}
```

---

### 3. Verify OTP

**Endpoint**: `POST /auth/verify-otp`

**Request Body**:
```json
{
  "mobile": "+1234567890",
  "otp": "123456"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "mobile": "+1234567890",
    "role": "patient"
  }
}
```

---

### 4. Google OAuth

**Endpoint**: `POST /auth/google`

**Request Body**:
```json
{
  "credential": "google_oauth_token"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "picture": "https://...",
    "role": "patient"
  }
}
```

---

### 5. Register

**Endpoint**: `POST /auth/register`

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "mobile": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "gender": "male"
}
```

**Success Response** (201):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

### 6. Logout

**Endpoint**: `POST /auth/logout`

**Headers**: `Authorization: Bearer <token>`

**Success Response** (200):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 💬 Chat APIs

### 1. Get All Chats

**Endpoint**: `GET /chats`

**Headers**: `Authorization: Bearer <token>`

**Success Response** (200):
```json
{
  "success": true,
  "chats": [
    {
      "id": "chat_001",
      "title": "Headache & Nausea",
      "date": "2024-10-24T10:30:00Z",
      "summary": "AI suggests monitoring hydration levels...",
      "status": "in-progress",
      "lastMessage": "How are you feeling now?",
      "createdAt": "2024-10-24T10:30:00Z"
    }
  ]
}
```

---

### 2. Get Specific Chat

**Endpoint**: `GET /chats/:chatId`

**Headers**: `Authorization: Bearer <token>`

**Success Response** (200):
```json
{
  "success": true,
  "chat": {
    "id": "chat_001",
    "userId": "user_123",
    "title": "Headache & Nausea",
    "messages": [
      {
        "id": "msg_001",
        "type": "user",
        "content": "I have a headache for 3 days",
        "timestamp": "2024-10-24T10:30:00Z"
      },
      {
        "id": "msg_002",
        "type": "assistant",
        "content": "I understand. Can you describe...",
        "timestamp": "2024-10-24T10:30:30Z"
      }
    ],
    "aiAnalysis": {
      "symptoms": ["headache", "nausea"],
      "severity": "moderate",
      "recommendation": "online-consultation"
    }
  }
}
```

---

### 3. Create New Chat

**Endpoint**: `POST /chats`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "title": "New Health Concern"
}
```

**Success Response** (201):
```json
{
  "success": true,
  "chatId": "chat_002",
  "message": "Chat created successfully"
}
```

---

### 4. Send Message

**Endpoint**: `POST /chats/:chatId/messages`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "content": "I have been experiencing chest pain",
  "type": "text"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": {
    "id": "msg_003",
    "content": "I have been experiencing chest pain",
    "timestamp": "2024-10-24T11:00:00Z"
  },
  "aiResponse": {
    "id": "msg_004",
    "content": "Chest pain can be serious. Can you describe...",
    "timestamp": "2024-10-24T11:00:10Z"
  }
}
```

---

### 5. Upload File (Image/Report)

**Endpoint**: `POST /chats/:chatId/upload`

**Headers**: 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Request Body** (FormData):
```
file: <binary>
type: "image" | "report"
```

**Success Response** (200):
```json
{
  "success": true,
  "fileUrl": "https://s3.amazonaws.com/mediai/uploads/img_123.jpg",
  "analysis": {
    "type": "skin_issue",
    "confidence": 0.85,
    "description": "Possible eczema or dermatitis"
  }
}
```

---

### 6. Analyze Health Issue

**Endpoint**: `POST /chats/:chatId/analyze`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "symptoms": ["fever", "sore throat", "fatigue"],
  "duration": "3 days",
  "severity": "moderate",
  "images": ["https://s3.../img_123.jpg"]
}
```

**Success Response** (200):
```json
{
  "success": true,
  "analysis": {
    "condition": "Viral Upper Respiratory Infection",
    "confidence": 0.78,
    "severity": "mild-moderate",
    "treatmentPath": "self-care",
    "recommendations": {
      "selfCare": [
        "Rest and hydration",
        "Over-the-counter pain relievers",
        "Saltwater gargle"
      ],
      "whenToSeekHelp": [
        "If fever exceeds 103°F",
        "If symptoms worsen after 5 days"
      ]
    },
    "specialization": "General Physician"
  }
}
```

---

## 👨‍⚕️ Doctor APIs

### 1. Search Doctors

**Endpoint**: `GET /doctors/search`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
```
?specialization=Cardiologist
&location=New York
&availability=available
&limit=10
```

**Success Response** (200):
```json
{
  "success": true,
  "doctors": [
    {
      "id": "doc_001",
      "name": "Dr. Sarah Johnson",
      "specialization": "Cardiologist",
      "experience": 15,
      "rating": 4.8,
      "reviews": 234,
      "hospital": "City General Hospital",
      "address": "123 Main St, New York, NY",
      "distance": 2.5,
      "availability": "available",
      "consultationFee": 150,
      "languages": ["English", "Spanish"]
    }
  ]
}
```

---

### 2. Get Nearby Doctors

**Endpoint**: `GET /doctors/nearby`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
```
?latitude=40.7128
&longitude=-74.0060
&specialization=Dermatologist
&radius=5
```

**Success Response** (200):
```json
{
  "success": true,
  "doctors": [
    {
      "id": "doc_002",
      "name": "Dr. Michael Chen",
      "specialization": "Dermatologist",
      "clinic": "Skin Care Clinic",
      "address": "456 Park Ave, New York, NY",
      "coordinates": {
        "lat": 40.7589,
        "lng": -73.9851
      },
      "distance": 1.2,
      "availability": "available",
      "nextAvailableSlot": "2024-10-25T14:00:00Z"
    }
  ]
}
```

---

### 3. Book Appointment

**Endpoint**: `POST /appointments/book`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "doctorId": "doc_001",
  "type": "video" | "audio" | "physical",
  "dateTime": "2024-10-25T14:00:00Z",
  "reason": "Follow-up consultation",
  "symptoms": ["chest pain", "shortness of breath"],
  "aiSummary": {
    "condition": "Possible angina",
    "severity": "moderate"
  }
}
```

**Success Response** (201):
```json
{
  "success": true,
  "appointment": {
    "id": "appt_001",
    "doctorId": "doc_001",
    "patientId": "user_123",
    "type": "video",
    "dateTime": "2024-10-25T14:00:00Z",
    "status": "confirmed",
    "meetingLink": "https://meet.google.com/xyz-abc-def"
  }
}
```

---

### 4. Start Video Consultation

**Endpoint**: `POST /appointments/:appointmentId/video`

**Headers**: `Authorization: Bearer <token>`

**Success Response** (200):
```json
{
  "success": true,
  "meetingLink": "https://meet.google.com/xyz-abc-def",
  "token": "video_room_token",
  "expiresIn": 3600
}
```

---

## 💊 Medicine APIs

### 1. Get All Medicines

**Endpoint**: `GET /medicines`

**Headers**: `Authorization: Bearer <token>`

**Success Response** (200):
```json
{
  "success": true,
  "medicines": [
    {
      "id": "med_001",
      "name": "Lisinopril",
      "dosage": "10 mg",
      "frequency": "once_daily",
      "timing": ["morning"],
      "duration": "30 days",
      "instructions": "Take with food",
      "startDate": "2024-10-24",
      "endDate": "2024-11-23",
      "reminders": true
    }
  ]
}
```

---

### 2. Add Medicine

**Endpoint**: `POST /medicines`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "name": "Amoxicillin",
  "dosage": "500 mg",
  "frequency": "three_times_daily",
  "timing": ["morning", "afternoon", "night"],
  "duration": "7 days",
  "instructions": "Take with water",
  "reminderEnabled": true
}
```

**Success Response** (201):
```json
{
  "success": true,
  "medicine": {
    "id": "med_002",
    "name": "Amoxicillin",
    "reminders": [
      {
        "time": "08:00:00",
        "period": "morning"
      },
      {
        "time": "14:00:00",
        "period": "afternoon"
      },
      {
        "time": "21:00:00",
        "period": "night"
      }
    ]
  }
}
```

---

### 3. Mark Medicine as Taken

**Endpoint**: `POST /medicines/:medicineId/taken`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "timestamp": "2024-10-24T08:15:00Z",
  "notes": "Taken with breakfast"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "log": {
    "medicineId": "med_001",
    "takenAt": "2024-10-24T08:15:00Z",
    "status": "taken"
  }
}
```

---

## 🍎 Food APIs

### 1. Search Food

**Endpoint**: `GET /food/search`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
```
?query=banana
```

**Success Response** (200):
```json
{
  "success": true,
  "results": [
    {
      "name": "Banana",
      "category": "Fruit",
      "nutrition": {
        "calories": 105,
        "protein": 1.3,
        "carbs": 27,
        "fiber": 3.1,
        "potassium": 422
      }
    }
  ]
}
```

---

### 2. Check Food Compatibility

**Endpoint**: `POST /food/check`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "foodName": "Salted Nuts",
  "healthConditions": ["hypertension", "diabetes"]
}
```

**Success Response** (200):
```json
{
  "success": true,
  "compatibility": {
    "status": "limit",
    "reason": "High sodium content may worsen hypertension",
    "recommendation": "Choose unsalted variants",
    "maxQuantity": "1 small handful (30g)",
    "alternatives": ["Unsalted almonds", "Walnuts"]
  }
}
```

---

### 3. Get Meal Plan

**Endpoint**: `GET /food/meal-plan`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
```
?date=2024-10-24
&conditions=hypertension,diabetes
```

**Success Response** (200):
```json
{
  "success": true,
  "mealPlan": {
    "date": "2024-10-24",
    "meals": [
      {
        "time": "08:00",
        "type": "breakfast",
        "name": "Oatmeal with Blueberries",
        "calories": 320,
        "description": "Fiber-rich, heart-healthy meal"
      },
      {
        "time": "13:00",
        "type": "lunch",
        "name": "Grilled Chicken Salad",
        "calories": 450,
        "description": "Lean protein with fresh vegetables"
      }
    ]
  }
}
```

---

## 📊 Health Tracking APIs

### 1. Get Health Logs

**Endpoint**: `GET /health/logs`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
```
?startDate=2024-10-01
&endDate=2024-10-24
```

**Success Response** (200):
```json
{
  "success": true,
  "logs": [
    {
      "id": "log_001",
      "date": "2024-10-24",
      "vitals": {
        "bloodPressure": {
          "systolic": 120,
          "diastolic": 80
        },
        "heartRate": 72,
        "temperature": 98.6,
        "weight": 75.5,
        "bloodSugar": 95
      },
      "symptoms": ["mild headache"],
      "notes": "Feeling better today"
    }
  ]
}
```

---

### 2. Add Health Log

**Endpoint**: `POST /health/logs`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "date": "2024-10-24",
  "vitals": {
    "bloodPressure": {
      "systolic": 118,
      "diastolic": 78
    },
    "heartRate": 70,
    "temperature": 98.4,
    "weight": 75.2
  },
  "symptoms": [],
  "mood": "good",
  "sleep": 7.5,
  "exercise": 30,
  "notes": "Morning walk completed"
}
```

**Success Response** (201):
```json
{
  "success": true,
  "log": {
    "id": "log_002",
    "date": "2024-10-24",
    "createdAt": "2024-10-24T09:00:00Z"
  }
}
```

---

### 3. Get Health Trends

**Endpoint**: `GET /health/trends`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
```
?metric=bloodPressure
&period=30days
```

**Success Response** (200):
```json
{
  "success": true,
  "trends": {
    "metric": "bloodPressure",
    "period": "30days",
    "data": [
      {
        "date": "2024-10-01",
        "systolic": 125,
        "diastolic": 82
      },
      {
        "date": "2024-10-02",
        "systolic": 122,
        "diastolic": 80
      }
    ],
    "analysis": {
      "average": {
        "systolic": 120,
        "diastolic": 79
      },
      "trend": "improving",
      "recommendation": "Continue current lifestyle"
    }
  }
}
```

---

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  mobile: String (unique),
  password: String (hashed),
  role: Enum["patient", "doctor"],
  dateOfBirth: Date,
  gender: Enum["male", "female", "other"],
  profilePicture: String (URL),
  createdAt: Date,
  updatedAt: Date
}
```

### Chats Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  title: String,
  status: Enum["in-progress", "completed"],
  messages: [
    {
      id: String,
      type: Enum["user", "assistant"],
      content: String,
      timestamp: Date,
      attachments: [String]
    }
  ],
  aiAnalysis: {
    symptoms: [String],
    condition: String,
    severity: String,
    treatmentPath: String,
    recommendations: Object
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Doctors Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  specialization: String,
  experience: Number,
  qualifications: [String],
  hospital: String,
  clinic: String,
  address: String,
  coordinates: {
    lat: Number,
    lng: Number
  },
  consultationFee: Number,
  availability: Enum["available", "busy", "unavailable"],
  rating: Number,
  reviews: Number,
  languages: [String],
  createdAt: Date
}
```

### Appointments Collection
```javascript
{
  _id: ObjectId,
  patientId: ObjectId (ref: Users),
  doctorId: ObjectId (ref: Doctors),
  type: Enum["video", "audio", "physical"],
  dateTime: Date,
  status: Enum["pending", "confirmed", "completed", "cancelled"],
  reason: String,
  symptoms: [String],
  aiSummary: Object,
  meetingLink: String,
  prescriptionId: ObjectId (ref: Prescriptions),
  createdAt: Date
}
```

### Prescriptions Collection
```javascript
{
  _id: ObjectId,
  appointmentId: ObjectId (ref: Appointments),
  doctorId: ObjectId (ref: Doctors),
  patientId: ObjectId (ref: Users),
  medicines: [
    {
      name: String,
      dosage: String,
      frequency: String,
      duration: String,
      instructions: String
    }
  ],
  diagnosis: String,
  notes: String,
  createdAt: Date
}
```

### Medicines Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  prescriptionId: ObjectId (ref: Prescriptions),
  name: String,
  dosage: String,
  frequency: String,
  timing: [String],
  duration: String,
  instructions: String,
  startDate: Date,
  endDate: Date,
  reminderEnabled: Boolean,
  adherence: [
    {
      scheduledTime: Date,
      takenAt: Date,
      status: Enum["taken", "missed", "skipped"],
      notes: String
    }
  ],
  createdAt: Date
}
```

### HealthLogs Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  date: Date,
  vitals: {
    bloodPressure: {
      systolic: Number,
      diastolic: Number
    },
    heartRate: Number,
    temperature: Number,
    weight: Number,
    bloodSugar: Number,
    oxygenLevel: Number
  },
  symptoms: [String],
  mood: String,
  sleep: Number,
  exercise: Number,
  notes: String,
  createdAt: Date
}
```

---

## ⚠️ Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

### Common Error Codes
```
AUTH_001: Invalid credentials
AUTH_002: Token expired
AUTH_003: OTP invalid or expired
DATA_001: Validation error
DATA_002: Resource not found
SERV_001: External service unavailable
AI_001: AI analysis failed
```

---

## 🔒 Security Requirements

1. **JWT Tokens**: Expire in 24 hours
2. **Password**: Minimum 8 characters, hashed with bcrypt
3. **Rate Limiting**: 100 requests per minute per user
4. **Input Validation**: Sanitize all inputs
5. **HTTPS**: Enforce in production
6. **CORS**: Whitelist frontend domains only
7. **SQL Injection**: Use parameterized queries
8. **API Keys**: Store in environment variables

---

## 📞 Support

For implementation questions:
- Backend Team Lead: [Contact Info]
- API Documentation: This document
- Postman Collection: [Link to Postman]

---

**Last Updated**: February 2026  
**Version**: 1.0.0
