# 🧠 AI Exam Portal

<p align="center">
  <img src="./Screenshots/ai_evaluation.png" width="580">
</p>

<h2 align="center">🚀 AI-Powered Full-Stack Online Examination Platform</h2>

<p align="center">
  A modern MERN-based examination platform with
  <b>AI question generation</b>, <b>answer evaluation</b>,
  <b>online examinations</b>, and <b>performance analytics</b>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white">
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white">
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white">
  <img src="https://img.shields.io/badge/JWT-8A2BE2?style=for-the-badge">
  <img src="https://img.shields.io/badge/AI-Powered-FF4FA3?style=for-the-badge">
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-ai-integration">AI</a> •
  <a href="#-screenshots">Screenshots</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-setup">Setup</a>
</p>

---

# 🌟 Overview

**AI Exam Portal** is a full-stack online examination platform designed for **Students, Teachers, and Administrators**.

It manages the complete examination lifecycle:


📝 Exam Creation
       ↓
📚 Question Management
       ↓
🤖 AI Question Generation
       ↓
🔍 Teacher Review
       ↓
🚀 Exam Publishing
       ↓
🎓 Student Examination
       ↓
🧠 Answer Evaluation
       ↓
📊 Results & Analytics

The platform combines traditional examination functionality with AI-assisted tools to reduce manual effort and improve the examination workflow.

✨ Features
🎓 Student Portal
<div align="center">
🔐 Authentication	📚 Exams	📝 Examination
Secure Login & Registration	View Published Exams	Interactive Exam Interface
⏱️ Timer	📊 Results	📜 History
Exam Countdown	Score & Percentage	Previous Attempts
</div>
Student capabilities
🔐 Secure registration and login
📚 View available examinations
📝 Attempt online examinations
⏱️ Countdown timer
🧭 Question navigation
📤 Answer submission
📊 Automatic result calculation
🏆 Score and percentage
✅ Correct answers
❌ Wrong answers
⏭️ Skipped questions
📜 Examination history
🛡️ Duplicate attempt protection
👨‍🏫 Teacher Portal
📋 Examination Management
📝 Create examinations
⚙️ Configure exam settings
📚 Add questions
✏️ Edit questions
🗑️ Manage questions
🚀 Publish examinations
🤖 AI Assistance
🧠 AI question generation
📄 Generate questions from study material
🔍 Review generated questions
✏️ Modify generated questions
💡 AI-assisted answer evaluation
📊 Performance
👥 View student attempts
📈 Examination analytics
🏆 Student performance
📊 Attempt statistics
🛡️ Admin Portal
Feature	Purpose
👥 User Management	Manage platform users
🎓 Student Management	Monitor students
👨‍🏫 Teacher Management	Monitor teachers
📊 Dashboard	View platform statistics
⚙️ Administration	Manage platform operations
🤖 AI Integration

AI is integrated into the actual examination workflow.

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
AI capabilities

🟣 AI-assisted question generation
🔵 Material-based question generation
🩷 AI-assisted answer evaluation
🟢 Teacher-controlled question review
⚡ Faster examination preparation

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
🔐 Authentication & Examination
<p align="center"> <img src="./Screenshots/Login.png" width="320"> &nbsp;&nbsp;&nbsp;&nbsp; <img src="./Screenshots/Available_exam.png" width="320"> </p> <p align="center"> <b>🔐 Login</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>📚 Available Examinations</b> </p> <br> <p align="center"> <img src="./Screenshots/exam.png" width="680"> </p> <p align="center"> <b>📝 Online Examination Interface</b> </p>
🎓 Student Experience
<p align="center"> <img src="./Screenshots/student_dashboard.png" width="320"> &nbsp;&nbsp;&nbsp;&nbsp; <img src="./Screenshots/results.png" width="320"> </p> <p align="center"> <b>🏠 Student Dashboard</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>📊 Examination Results</b> </p> <br> <p align="center"> <img src="./Screenshots/ranking.png" width="680"> </p> <p align="center"> <b>🏆 Ranking & Performance</b> </p>
👨‍🏫 Teacher & 🛡️ Admin
<p align="center"> <img src="./Screenshots/teacher_dashboard.png" width="320"> &nbsp;&nbsp;&nbsp;&nbsp; <img src="./Screenshots/admin_dashboard.png" width="320"> </p> <p align="center"> <b>👨‍🏫 Teacher Dashboard</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>🛡️ Admin Dashboard</b> </p> <br> <p align="center"> <img src="./Screenshots/admin_approval.png" width="680"> </p> <p align="center"> <b>✅ Admin Approval</b> </p>
🤖 AI-Assisted Evaluation
<p align="center"> <img src="./Screenshots/ai_evaluation.png" width="680"> </p> <p align="center"> <b>🧠 AI-Assisted Answer Evaluation</b> </p>
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
   🔐 Auth            📝 Exam System       🤖 AI Layer
        │                  │                  │
        │            ┌─────┴─────┐      ┌─────┴─────┐
        │            │           │      │           │
        ▼            ▼           ▼      ▼           ▼
      JWT       Questions    Attempts  Generation Evaluation
                     │           │
                     └─────┬─────┘
                           ▼
                      🍃 MongoDB
🧩 System Roles
             🧠 AI EXAM PORTAL
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
     🎓 Student   👨‍🏫 Teacher   🛡️ Admin
        │            │            │
        ▼            ▼            ▼
     Attempt       Create       Manage
      Exams         Exams         Users
        │            │            │
        ▼            ▼            ▼
     Results       Analytics    Platform
🛠️ Technology Stack
🎨 Frontend
<p> <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black"> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black"> <img src="https://img.shields.io/badge/CSS-1572B6?style=flat-square&logo=css3"> <img src="https://img.shields.io/badge/Axios-5A29E4?style=flat-square"> <img src="https://img.shields.io/badge/React_Router-CA4245?style=flat-square&logo=reactrouter"> </p>
⚙️ Backend
<p> <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs"> <img src="https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express"> <img src="https://img.shields.io/badge/REST_API-6C63FF?style=flat-square"> <img src="https://img.shields.io/badge/JWT-8A2BE2?style=flat-square"> </p>
🍃 Database
<p> <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb"> <img src="https://img.shields.io/badge/Mongoose-880000?style=flat-square&logo=mongoose"> </p>
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
  ↓
🔐 Login
  ↓
🎟️ JWT Token
  ↓
🛡️ Protected Route
  ↓
👮 Role Authorization
  ↓
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
▶️ /api/exam-attempts	Exam attempts & submission
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
✅ Correct	Correct answers
❌ Wrong	Incorrect answers
⏭️ Skipped	Unanswered questions
🎯 Result	Pass / Fail
⏱️ Time Taken	Examination time
🔄 Attempt Status	Current attempt state
🚀 Setup
1️⃣ Clone
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

Create .env inside the backend folder:

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

🔔 Email notifications
⚡ Real-time notifications
📊 Advanced analytics
🧠 Enhanced AI evaluation
🏆 Advanced leaderboard
📱 Progressive Web App
☁️ Improved cloud deployment
🔐 Additional examination security

👩‍💻 Author
<p align="center">
Aditi Singh

<b>Full-Stack Developer • MERN Stack • AI Integration</b>

<br><br>

<a href="https://github.com/AditiRaySingh"> <img src="https://img.shields.io/badge/GitHub-AditiRaySingh-181717?style=for-the-badge&logo=github"> </a> </p>
⭐ Support

If you find this project interesting:

⭐ Star the repository
🍴 Fork the project
💡 Share feedback
🚀 Explore the project

<p align="center">
🧠 AI Exam Portal

<b>AI-Assisted Examination • Secure Access • Performance Analytics</b>

<br><br>

Built with ❤️ using the <b>MERN Stack</b>

</p> 
