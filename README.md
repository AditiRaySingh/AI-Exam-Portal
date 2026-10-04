# 🧠 AI Exam Portal

<p align="center">
  <img src="./Screenshots/ai_evaluation.png" width="520" alt="AI Exam Portal">
</p>

<h2 align="center">AI-Powered Full-Stack Online Examination Platform</h2>

<p align="center">
  A modern MERN-based examination platform combining online assessments,
  AI-assisted question generation, answer evaluation, role-based access,
  and performance analytics.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black">
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white">
  <img src="https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white">
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white">
  <img src="https://img.shields.io/badge/JWT-7B61FF?style=flat-square">
  <img src="https://img.shields.io/badge/AI-FF4FA3?style=flat-square">
</p>

<p align="center">
  <a href="#-overview">Overview</a> •
  <a href="#-features">Features</a> •
  <a href="#-ai-integration">AI</a> •
  <a href="#-screenshots">Screenshots</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-setup">Setup</a>
</p>

---

## 🌟 Overview

**AI Exam Portal** is a full-stack examination platform designed for:

| 👨‍🎓 Student | 👨‍🏫 Teacher | 🛡️ Admin |
|:---:|:---:|:---:|
| Attempt examinations | Create examinations | Manage users |
| View results | Manage questions | Monitor platform |
| Track history | AI question generation | View statistics |
| View performance | Analytics | Administrative operations |

The platform manages the complete examination lifecycle from **exam creation to performance analytics**.

### 🎯 Main Objectives

- 📝 Provide an interactive online examination experience
- 📚 Simplify examination and question management
- 🤖 Reduce manual effort using AI-assisted generation
- 📄 Generate questions from study material
- 🧠 Assist with answer evaluation
- 📊 Provide detailed performance analytics
- 🔐 Implement secure authentication and authorization
- 🛡️ Prevent duplicate examination attempts

---

# ✨ Features

## 🎓 Student Features


🔐 Secure Authentication
        ↓
📚 Browse Published Exams
        ↓
📝 Attempt Examination
        ↓
⏱️ Timer & Question Navigation
        ↓
📤 Submit Answers
        ↓
📊 View Results
        ↓
📜 View Examination History
Student Capabilities
Secure registration and login
View published examinations
Interactive examination interface
Countdown timer
Question navigation
Answer submission
Automatic score calculation
Percentage and result status
Correct / wrong / skipped statistics
Examination history
Duplicate attempt protection
👨‍🏫 Teacher Features
Feature	Description
📝 Exam Creation	Create and configure examinations
📚 Question Management	Add, edit and manage questions
🤖 AI Generation	Generate questions using AI
📄 Material Generation	Generate questions from study material
🔍 Question Review	Review and modify generated questions
🚀 Publishing	Publish examinations for students
👥 Student Results	View student performance
📈 Analytics	Analyze examination performance
📊 Statistics	Track students and attempts
🛡️ Admin Features
👥 User management
🎓 Student management
👨‍🏫 Teacher management
📊 Platform statistics
⚙️ Administrative operations
🔐 Role-based access control
🤖 AI Integration

AI is integrated directly into the examination workflow to assist teachers.

🧠 AI Question Generation
📚 Study Material
       │
       ▼
🤖 AI Processing
       │
       ▼
📝 Generated Questions
       │
       ▼
👨‍🏫 Teacher Review
       │
       ▼
🚀 Examination
AI Capabilities
🤖 Capability	Purpose
🧠 AI Question Generation	Generate examination questions
📄 Material-Based Generation	Generate questions from study material
💬 AI Answer Evaluation	Assist with answer evaluation
🔍 Teacher Review	Teacher reviews generated questions
⚡ Faster Preparation	Reduce manual question creation

AI assists the teacher while keeping the final review and control with the teacher.

🔄 Examination Workflow
👨‍🏫 Teacher
📝 Create Exam
      ↓
📚 Add Questions
      ↓
🤖 Generate Questions with AI
      ↓
🔍 Review Questions
      ↓
🚀 Publish Exam
🎓 Student
📚 View Published Exam
      ↓
▶️ Start Exam
      ↓
✍️ Answer Questions
      ↓
📤 Submit Exam
⚙️ System
🧠 Evaluate Answers
      ↓
📊 Calculate Score
      ↓
🏆 Generate Result
      ↓
📈 Update Analytics
📸 Screenshots
🔐 Authentication & Exams
<p align="center"> <img src="./Screenshots/Login.png" width="340" alt="Login"> &nbsp;&nbsp;&nbsp; <img src="./Screenshots/Available_exam.png" width="340" alt="Available Exams"> </p> <p align="center"> <b>🔐 Login</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>📚 Available Examinations</b> </p> <br> <p align="center"> <img src="./Screenshots/exam.png" width="720" alt="Online Examination"> </p> <p align="center"> <b>📝 Online Examination Interface</b> </p>
🎓 Student Dashboard & Results
<p align="center"> <img src="./Screenshots/student_dashboard.png" width="340" alt="Student Dashboard"> &nbsp;&nbsp;&nbsp; <img src="./Screenshots/results.png" width="340" alt="Results"> </p> <p align="center"> <b>🎓 Student Dashboard</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>📊 Examination Results</b> </p> <br> <p align="center"> <img src="./Screenshots/ranking.png" width="620" alt="Ranking"> </p> <p align="center"> <b>🏆 Ranking & Performance</b> </p>
👨‍🏫 Teacher & 🛡️ Admin
<p align="center"> <img src="./Screenshots/teacher_dashboard.png" width="340" alt="Teacher Dashboard"> &nbsp;&nbsp;&nbsp; <img src="./Screenshots/admin_dashboard.png" width="340" alt="Admin Dashboard"> </p> <p align="center"> <b>👨‍🏫 Teacher Dashboard</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>🛡️ Admin Dashboard</b> </p> <br> <p align="center"> <img src="./Screenshots/admin_approval.png" width="620" alt="Admin Approval"> </p> <p align="center"> <b>✅ Admin Approval</b> </p>
🤖 AI-Assisted Evaluation
<p align="center"> <img src="./Screenshots/ai_evaluation.png" width="620" alt="AI Evaluation"> </p> <p align="center"> <b>🧠 AI-Assisted Answer Evaluation</b> </p>
🏗️ Architecture
                    🌐 React Frontend
                           │
                           │ REST API
                           ▼
                 🚀 Node.js + Express
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
   🔐 Authentication   📝 Exam System      🤖 AI Services
        │                  │                  │
        │            ┌─────┴─────┐      ┌─────┴─────┐
        │            │           │      │           │
        ▼            ▼           ▼      ▼           ▼
      JWT       Questions    Attempts  Generation  Evaluation
                     │           │
                     └─────┬─────┘
                           ▼
                      🍃 MongoDB
👥 Role-Based System
Role	Main Responsibilities
🎓 Student	Attempt exams, submit answers, view results and history
👨‍🏫 Teacher	Create exams, manage questions, generate AI questions and analyze results
🛡️ Admin	Manage users, monitor platform and perform administrative operations
🛠️ Technology Stack
🎨 Frontend
<p> <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black"> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black"> <img src="https://img.shields.io/badge/CSS-1572B6?style=flat-square&logo=css3&logoColor=white"> <img src="https://img.shields.io/badge/Axios-5A29E4?style=flat-square"> <img src="https://img.shields.io/badge/React_Router-CA4245?style=flat-square&logo=reactrouter"> </p>
⚙️ Backend
<p> <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white"> <img src="https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white"> <img src="https://img.shields.io/badge/REST_API-6C63FF?style=flat-square"> <img src="https://img.shields.io/badge/JWT-7B61FF?style=flat-square"> </p>
🍃 Database
<p> <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white"> <img src="https://img.shields.io/badge/Mongoose-880000?style=flat-square&logo=mongoose&logoColor=white"> </p>
🤖 AI
<p> <img src="https://img.shields.io/badge/Question_Generation-9C27B0?style=flat-square"> <img src="https://img.shields.io/badge/Material_Generation-673AB7?style=flat-square"> <img src="https://img.shields.io/badge/Answer_Evaluation-E91E63?style=flat-square"> </p>
📁 Project Structure
AI-Exam-Portal/
│
├── 🎨 frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── styles/
│       ├── services/
│       ├── assets/
│       └── App.jsx
│
├── ⚙️ backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── 📸 Screenshots/
│
├── .gitignore
└── README.md
🔐 Security

The application uses JWT authentication and role-based authorization.

👤 User
  │
  ▼
🔐 Login / Registration
  │
  ▼
🎟️ JWT Token
  │
  ▼
🛡️ Protected Route
  │
  ▼
👮 Role Authorization
  │
  ▼
✅ Requested Resource
Security Features
🔐 JWT authentication
🛡️ Protected API routes
👥 Role-based authorization
🔒 Student / Teacher route separation
⏱️ Examination timing validation
🚫 Duplicate attempt protection
🙈 Correct answers hidden during examination
📤 Protected answer submission
📡 API Modules
Endpoint	Purpose
🔐 /api/auth	Authentication & registration
📝 /api/exams	Examination management
📚 /api/questions	Question management
▶️ /api/exam-attempts	Attempts & submission
📊 /api/dashboard	Dashboard information
📄 /api/ai/material	Material-based AI generation
🤖 /api/ai/question	AI question generation
🧠 /api/ai/evaluation	AI answer evaluation
🏆 /api/results	Result management
🛡️ /api/admin	Administrative operations
📊 Evaluation System
Metric	Description
🏆 Score	Marks obtained
📊 Percentage	Overall examination percentage
✅ Correct	Number of correct answers
❌ Wrong	Number of incorrect answers
⏭️ Skipped	Number of unanswered questions
🎯 Result	Pass / Fail
⏱️ Time Taken	Time spent during examination
🔄 Attempt Status	Current attempt state
📂 Setup
1️⃣ Clone Repository
git clone https://github.com/AditiRaySingh/AI-Exam-Portal.git
cd AI-Exam-Portal
2️⃣ Backend
cd backend
npm install
npm start
3️⃣ Frontend

Open another terminal:

cd frontend
npm install
npm run dev
🔑 Environment Variables

Create a .env file inside the backend directory:

PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_ai_api_key

⚠️ Never commit .env files, database credentials, JWT secrets, or AI API keys.

🌐 Local Development
Service	URL
🎨 Frontend	http://localhost:5173
⚙️ Backend	http://localhost:3000
💡 Engineering Highlights
Area	Implementation
🎨 Frontend	React responsive interface
⚙️ Backend	Node.js + Express REST APIs
🍃 Database	MongoDB + Mongoose
🔐 Authentication	JWT
🛡️ Authorization	Role-based access control
📝 Examination	Complete exam lifecycle
🤖 AI	Question generation & answer evaluation
📚 Questions	Manual & AI-assisted
📊 Evaluation	Score, percentage, correct, wrong, skipped
📈 Analytics	Student & teacher performance
🔒 Security	Protected routes & attempt control
🌙 UI	Responsive dark-themed interface
🗺️ Future Improvements
🚀 Planned Feature	
📧 Email Notifications	Planned
⚡ Real-Time Notifications	Planned
📊 Advanced Analytics	Planned
🧠 Enhanced AI Evaluation	Planned
🏆 Advanced Leaderboard	Planned
📱 Progressive Web App	Planned
☁️ Cloud Deployment Improvements	Planned
🔐 Additional Exam Security	Planned
👩‍💻 Author
<p align="center">
Aditi Singh

Full-Stack Developer · MERN Stack · AI Integration

<br> <a href="https://github.com/AditiRaySingh"> <img src="https://img.shields.io/badge/GitHub-AditiRaySingh-181717?style=for-the-badge&logo=github"> </a> </p>
⭐ Support

If you find this project interesting:

⭐ Star the repository   •  
🍴 Fork the project   •  
💡 Share feedback

<p align="center">
🧠 AI Exam Portal

AI-Assisted Examination · Secure Access · Performance Analytics

<br>

Built with ❤️ using the MERN Stack

</p> 
