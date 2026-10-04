# 🧠 AI Exam Portal

<div align="center">

### 🚀 AI-Powered Online Examination & Assessment Platform

A full-stack examination platform designed to simplify **exam creation, secure exam attempts, automated evaluation, AI-assisted question generation, result analysis, and performance tracking**.

<br />

![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/API-Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![AI](https://img.shields.io/badge/AI-Powered-8B5CF6?style=for-the-badge)

</div>

---

## 📌 About The Project

**AI Exam Portal** is a full-stack web application that provides a complete digital examination workflow for **Students, Teachers, and Administrators**.

The platform allows teachers to create and manage examinations, add questions manually or with AI assistance, publish scheduled exams, and analyze student performance.

Students can securely attempt published exams, answer different types of questions, submit their attempts, and view their performance and results.

The project focuses on combining:

- 🤖 AI-assisted question generation
- 🔐 Role-based authentication
- 📝 Online examination management
- ⏱️ Scheduled and timed examinations
- 📊 Automated result evaluation
- 📈 Performance analytics
- 🛡️ Exam-attempt protection
- 👥 Multi-role dashboards

---

# ✨ Key Features

## 👨‍🎓 Student

- 🔐 Secure registration and login
- 📚 View available published examinations
- 📝 Start scheduled examinations
- ⏱️ Exam timer
- 📑 Question navigation
- ✅ MCQ and True/False evaluation
- ✍️ Subjective-answer evaluation
- ⏭️ Track skipped questions
- 🚫 Prevent duplicate exam attempts
- ⚡ Automatic submission support
- 📊 View examination results
- 📈 Track examination history
- 🏆 Performance/ranking features

---

## 👨‍🏫 Teacher

- 🔐 Secure teacher authentication
- 📋 Create examinations
- 📝 Add and manage questions
- ✏️ Edit examination details
- 🗑️ Delete examinations
- 📅 Configure examination start/end times
- 📢 Publish examinations
- 🤖 Generate questions using AI
- 📚 Generate questions from study material
- 👥 View student attempts
- 📊 View examination results
- 📈 Analyze student performance
- 📌 Dashboard statistics

---

## 🛡️ Admin

- 👤 Administrative access
- 📊 Admin dashboard
- 👥 User management capabilities
- 🔐 Role-based access control
- 🧩 Separate administrative routes

---

# 🤖 AI-Powered Question Generation

The platform integrates AI into the examination creation workflow.

Teachers can use AI assistance to reduce the time required to prepare examination questions.

### AI Workflow

```text
              ┌─────────────────────┐
              │    Teacher          │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │  Enter Requirements │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │    AI Processing    │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ Generated Questions │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ Teacher Reviews     │
              │ & Adds Questions    │
              └─────────────────────┘
```

### Material-Based Generation

```text
Study Material
      │
      ▼
Upload Material
      │
      ▼
AI Processing
      │
      ▼
Generate Questions
      │
      ▼
Teacher Review
      │
      ▼
Add Questions to Exam
```

---

# 📝 Supported Question Types

The system supports multiple question formats:

| Question Type | Supported |
|---|:---:|
| Multiple Choice Questions | ✅ |
| True / False | ✅ |
| Short Answer | ✅ |
| Detailed / Subjective Answer | ✅ |

This allows the platform to support both objective and descriptive assessments.

---

# 🔐 Security & Exam Protection

Security is an important part of the examination workflow.

### Authentication

The application uses **JWT-based authentication** for protected APIs and role-based access.

```text
User Login
    ↓
JWT Token
    ↓
Protected API
    ↓
Authentication Middleware
    ↓
Role Authorization
    ↓
Controller
```

### Role-Based Access

```text
                    ┌───────────────┐
                    │ Authentication│
                    └───────┬───────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
           Student        Teacher        Admin
              │             │             │
              ▼             ▼             ▼
           Exams         Manage Exams   Admin APIs
           Results       Questions       Dashboard
           History       Analytics       Management
```

### Exam Attempt Protection

The backend validates important exam conditions such as:

- ✅ Exam must be published
- ✅ Start time validation
- ✅ End time validation
- ✅ Student authorization
- ✅ Duplicate attempt prevention
- ✅ Submission status validation
- ✅ Server-side score calculation

This prevents the frontend alone from controlling important examination logic.

---

# 📊 Result & Evaluation System

After submission, the backend evaluates the attempt and calculates:

- 🎯 Score
- 📈 Percentage
- ✅ Correct answers
- ❌ Wrong answers
- ⏭️ Skipped answers
- 🏁 Pass / Fail result
- ⏱️ Time taken
- 📋 Attempt history

### Evaluation Flow

```text
Student Answers
       ↓
Submit Examination
       ↓
Backend Validation
       ↓
Question Evaluation
       ↓
Score Calculation
       ↓
Percentage Calculation
       ↓
Pass / Fail
       ↓
Store Result
       ↓
Display Result
```

---

# 📈 Analytics

Teachers can use result and analytics features to understand student performance.

The system provides information such as:

- 📊 Student scores
- 📈 Performance trends
- 👥 Attempt statistics
- 🎯 Correct / wrong / skipped answers
- 🏆 High-performing students
- 📋 Detailed examination results

---

# 🏗️ Application Architecture

```text
┌──────────────────────────────────────────────────────┐
│                    React Frontend                    │
│                                                      │
│  Student Dashboard │ Teacher Dashboard │ Admin       │
│  Exam UI           │ Exam Management   │ Dashboard   │
│  Results           │ AI Generation      │             │
└─────────────────────────┬────────────────────────────┘
                          │
                       Axios
                          │
                          ▼
┌──────────────────────────────────────────────────────┐
│                Node.js + Express API                 │
│                                                      │
│ Authentication │ Exams │ Questions │ Attempts        │
│ Results        │ AI    │ Dashboard │ Admin           │
└─────────────────────────┬────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────┐
│                    MongoDB                           │
│                                                      │
│ Users │ Exams │ Questions │ Attempts │ Results       │
└──────────────────────────────────────────────────────┘
                          │
                          │
                          ▼
                 ┌─────────────────┐
                 │   AI Service    │
                 │ Question        │
                 │ Generation      │
                 └─────────────────┘
```

---

# 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, React Router, Axios, CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT |
| AI | AI API integration |
| API Communication | REST APIs |
| Testing | Postman |
| Development | VS Code |
| Version Control | Git & GitHub |

---

# 📁 Project Structure

```text
AI-Exam-Portal/
│
├── backend/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── aiMaterialController.js
│   │   ├── authController.js
│   │   ├── examAttemptController.js
│   │   └── examController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── models/
│   │   ├── examModel.js
│   │   ├── examAttemptModel.js
│   │   └── userModel.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── examRoutes.js
│   │   ├── examAttemptRoutes.js
│   │   ├── questionRoutes.js
│   │   ├── resultRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── adminRoutes.js
│   │
│   ├── createAdmin.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   └── App.jsx
│   │
│   ├── .env
│   └── package.json
│
├── Screenshots/
│
├── README.md
└── .gitignore
```

---

# 🔄 Complete User Workflow

## Teacher Workflow

```text
Login
  ↓
Teacher Dashboard
  ↓
Create Exam
  ↓
Configure Exam
  ↓
Add Questions
  │
  ├── Manual Questions
  │
  └── AI Generated Questions
  ↓
Review Questions
  ↓
Publish Exam
  ↓
Students Attempt Exam
  ↓
View Results
  ↓
Analyze Performance
```

## Student Workflow

```text
Register / Login
       ↓
Student Dashboard
       ↓
View Published Exams
       ↓
Check Exam Schedule
       ↓
Start Exam
       ↓
Answer Questions
       ↓
Submit / Auto Submit
       ↓
Evaluation
       ↓
View Result
       ↓
Track Performance
```

---

# 🔌 Main API Modules

The backend is organized into separate REST API modules.

| Module | Purpose |
|---|---|
| Authentication | Registration, login, authorization |
| Exams | Create, update, publish and manage exams |
| Questions | Add and manage examination questions |
| Attempts | Start, submit and track exam attempts |
| Results | Student and teacher result access |
| Dashboard | Dashboard statistics |
| AI | AI-assisted question generation |
| Admin | Administrative functionality |

---

# 📸 Screenshots

## 👨‍🎓 Student Dashboard

![Student Dashboard](Screenshots/student-dashboard.png)

---

## 📝 Available Exams

![Available Exams](Screenshots/Exams.png)

---

## 👨‍🏫 Teacher Dashboard

![Teacher Dashboard](Screenshots/teacher%20dashboard.png)

---

## 📊 Teacher Analytics

![Teacher Analytics](Screenshots/teacher%20analyzing.png)

---

## 📈 Teacher Dashboard

![Teacher Dashboard](Screenshots/teacherDashboard.png)

---

## 📋 Examination Result

![Examination Result](Screenshots/result.png)

---

## 🏆 Leaderboard

![Leaderboard](Screenshots/leaderboard.png)

---

# ⚙️ Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/AditiRaySingh/AI-Exam-Portal.git

cd AI-Exam-Portal
```

---

## 2️⃣ Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
AI_API_KEY=your_ai_api_key
```

Start the backend:

```bash
npm run dev
```

---

## 3️⃣ Setup Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start using the Vite development server.

---

# 🔑 Environment Variables

Never commit real API keys, database credentials, or JWT secrets to GitHub.

Example:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
AI_API_KEY=your_ai_api_key
```

Use your own credentials locally.

---

# 🧪 Testing

The backend APIs can be tested using tools such as **Postman**.

Important workflows to test:

```text
Authentication
      ↓
Create Exam
      ↓
Add Questions
      ↓
Publish Exam
      ↓
Start Exam
      ↓
Submit Exam
      ↓
Generate Result
      ↓
View Analytics
```

---

# 🚀 Key Project Highlights

### 🤖 AI Integration
AI assistance reduces the manual effort required to create examination questions.

### 🔐 Secure Architecture
Authentication, protected routes, role-based authorization, and server-side validation help protect examination workflows.

### 📝 Complete Examination Lifecycle
The application handles the complete lifecycle from exam creation to final result analysis.

### 📊 Data-Driven Assessment
Teachers can review student performance through examination results and analytics.

### 🧩 Modular Backend
Controllers, routes, models, and middleware are separated to keep the backend maintainable and scalable.

### 🎨 Modern User Interface
The application uses a responsive dark SaaS-style interface designed for Students, Teachers, and Admins.

---

# 🔮 Future Improvements

Potential improvements for future versions include:

- 📹 Advanced proctoring
- 👁️ Face verification
- 🔊 Audio monitoring
- 📧 Email notifications
- 📱 Mobile application
- ☁️ Cloud file storage
- 📊 Advanced teacher analytics
- 🧠 Adaptive examinations
- 📚 AI-generated personalized assessments
- 🔔 Real-time examination notifications

---

# 🎯 Why This Project?

Traditional examination systems often require separate tools for:

- Exam creation
- Question management
- Examination delivery
- Evaluation
- Result analysis

This project brings these workflows together into a **single full-stack platform** with AI-assisted functionality.

---

# 👩‍💻 Author

## Aditi Ray Singh

**Full-Stack Developer**

React • JavaScript • Node.js • Express.js • MongoDB • REST APIs • AI Integration

---

<div align="center">

### ⭐ If you find this project interesting, consider giving the repository a star!

**Built with React + Node.js + MongoDB + AI 🤖**

</div>
