# 🧠 AI Exam Portal

<p align="center">
  <img src="./Screenshots/ai_evaluation.png" width="500">
</p>

<h3 align="center">
  🚀 AI-Powered Full-Stack Online Examination Platform
</h3>

<p align="center">
  A modern MERN-based examination platform combining
  <b>online assessments</b>, <b>AI question generation</b>,
  <b>answer evaluation</b>, and <b>performance analytics</b>.
</p>

<p align="center">

![React](https://img.shields.io/badge/React-2026-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-darkgreen?style=for-the-badge&logo=mongodb)
![JWT](https://img.shields.io/badge/Auth-JWT-purple?style=for-the-badge&logo=jsonwebtokens)
![AI](https://img.shields.io/badge/AI-Powered-ff69b4?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-yellow?style=for-the-badge&logo=javascript)

</p>

---

## 🌟 Project Overview

**AI Exam Portal** is a full-stack online examination platform designed for:

🟣 **Students** — attempt exams, submit answers, and track results  
🔵 **Teachers** — create exams, manage questions, and analyze performance  
🟢 **Administrators** — manage users and monitor the platform  
🩷 **AI Services** — generate questions and assist with answer evaluation  

The platform manages the complete examination lifecycle from **exam creation → question generation → examination → evaluation → results → analytics**.

---

# ✨ Features

## 🎓 Student Portal

| Feature | Description |
|---|---|
| 🔐 Authentication | Secure registration and login |
| 📚 Exam Dashboard | View available published examinations |
| 📝 Online Examination | Attempt examinations through an interactive interface |
| ⏱️ Timer | Track remaining examination time |
| 🧭 Navigation | Move between examination questions |
| 📤 Submission | Submit examination answers |
| 📊 Results | View score, percentage and result |
| 📜 History | View previous examination attempts |
| 🛡️ Attempt Protection | Prevent duplicate attempts |

---

## 👨‍🏫 Teacher Portal

| Feature | Description |
|---|---|
| 📝 Exam Creation | Create and configure examinations |
| 📚 Question Management | Add and manage questions |
| 🤖 AI Generation | Generate questions using AI |
| 📄 Material Generation | Generate questions from study material |
| 🔍 Question Review | Review and modify generated questions |
| 🚀 Publishing | Publish examinations for students |
| 👥 Student Results | View student performance |
| 📈 Analytics | Analyze examination performance |
| 📊 Statistics | Track students and attempts |

---

## 🛡️ Admin Portal

| Feature | Description |
|---|---|
| 👥 User Management | Manage platform users |
| 🎓 Student Management | Monitor student accounts |
| 👨‍🏫 Teacher Management | Monitor teacher accounts |
| 📊 Dashboard | View platform statistics |
| ⚙️ Administration | Manage examination-related operations |

---

# 🤖 AI-Powered Examination

AI is integrated into the actual examination workflow.

### 🧠 AI Question Generation


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

🩷 AI-assisted question generation
💜 Material-based question generation
💙 AI-assisted answer evaluation
💚 Teacher review before generated questions are used
⚡ Faster examination preparation

AI assists teachers while keeping the final review and control with the teacher.

🔄 Examination Workflow
👨‍🏫 Teacher
📝 Create Exam
      ↓
📚 Add Questions / 🤖 Generate Questions
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
🏗️ System Architecture
                    🌐 React Frontend
                           │
                           │ REST API
                           ▼
                🚀 Node.js + Express
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
    🔐 Authentication   📝 Exams       🤖 AI Services
          │                │                │
          ▼                ▼                ▼
     JWT + Roles       Questions      Generation /
                       Attempts        Evaluation
                           │
                           ▼
                     🍃 MongoDB
📸 Screenshots
🔐 Authentication & Examination
<p align="center"> <img src="./Screenshots/Login.png" width="210"> &nbsp;&nbsp;&nbsp; <img src="./Screenshots/Available_exam.png" width="210"> &nbsp;&nbsp;&nbsp; <img src="./Screenshots/exam.png" width="210"> </p> <p align="center"> 🔐 Login &nbsp;&nbsp; • &nbsp;&nbsp; 📚 Available Exams &nbsp;&nbsp; • &nbsp;&nbsp; 📝 Examination </p>
🎓 Student Experience
<p align="center"> <img src="./Screenshots/student_dashboard.png" width="210"> &nbsp;&nbsp;&nbsp; <img src="./Screenshots/results.png" width="210"> &nbsp;&nbsp;&nbsp; <img src="./Screenshots/ranking.png" width="210"> </p> <p align="center"> 🏠 Dashboard &nbsp;&nbsp; • &nbsp;&nbsp; 📊 Results &nbsp;&nbsp; • &nbsp;&nbsp; 🏆 Ranking </p>
👨‍🏫 Teacher & 🛡️ Admin
<p align="center"> <img src="./Screenshots/teacher_dashboard.png" width="210"> &nbsp;&nbsp;&nbsp; <img src="./Screenshots/admin_dashboard.png" width="210"> &nbsp;&nbsp;&nbsp; <img src="./Screenshots/admin_approval.png" width="210"> </p> <p align="center"> 👨‍🏫 Teacher Dashboard &nbsp;&nbsp; • &nbsp;&nbsp; 🛡️ Admin Dashboard &nbsp;&nbsp; • &nbsp;&nbsp; ✅ Approval </p>
🤖 AI Evaluation
<p align="center"> <img src="./Screenshots/ai_evaluation.png" width="430"> </p> <p align="center"> <b>AI-Assisted Answer Evaluation</b> </p>
📊 Dashboards & Analytics
🎓 Student Dashboard

Students can access:

📚 Available examinations
📝 Examination attempts
📊 Results
📈 Performance information
📜 Examination history
👨‍🏫 Teacher Dashboard

Teachers can monitor:

📝 Total examinations
👥 Total students
📊 Total attempts
📚 Created examinations
🤖 AI question generation
📄 Material-based generation
📈 Student performance
🏆 Examination analytics
🛡️ Admin Dashboard

Administrators can access:

👥 User management
🎓 Student management
👨‍🏫 Teacher management
📊 Platform statistics
⚙️ Administrative operations
🛠️ Technology Stack
🎨 Frontend
<p> <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black"> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black"> <img src="https://img.shields.io/badge/CSS-1572B6?style=flat-square&logo=css3"> <img src="https://img.shields.io/badge/Axios-5A29E4?style=flat-square"> <img src="https://img.shields.io/badge/React_Router-CA4245?style=flat-square&logo=reactrouter"> </p>
⚙️ Backend
<p> <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs"> <img src="https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express"> <img src="https://img.shields.io/badge/REST_API-6C63FF?style=flat-square"> <img src="https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens"> </p>
🗄️ Database
<p> <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb"> <img src="https://img.shields.io/badge/Mongoose-880000?style=flat-square&logo=mongoose"> </p>
🤖 AI
<p> <img src="https://img.shields.io/badge/AI_Question_Generation-9C27B0?style=flat-square"> <img src="https://img.shields.io/badge/Material_Based_Generation-673AB7?style=flat-square"> <img src="https://img.shields.io/badge/AI_Answer_Evaluation-E91E63?style=flat-square"> </p>
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
🔐 /api/auth	Authentication
📝 /api/exams	Examination management
📚 /api/questions	Question management
▶️ /api/exam-attempts	Exam attempts and submission
📊 /api/dashboard	Dashboard information
📄 /api/ai/material	Material-based AI generation
🤖 /api/ai/question	AI question generation
🧠 /api/ai/evaluation	AI answer evaluation
🏆 /api/results	Result management
🛡️ /api/admin	Administrative operations
📈 Evaluation System
Metric	Description
🏆 Score	Marks obtained
📊 Percentage	Overall examination percentage
✅ Correct	Correct answers
❌ Wrong	Incorrect answers
⏭️ Skipped	Unanswered questions
🎯 Result	Pass / Fail
⏱️ Time Taken	Examination time
🔄 Attempt Status	Current attempt state
🚀 Installation & Setup
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

Create .env inside the backend directory:

PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_ai_api_key

⚠️ Never commit .env files, database credentials, JWT secrets, or AI API keys to GitHub.

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
🤖 AI	Question generation & evaluation
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
📱 Progressive Web App support
☁️ Improved cloud deployment
🔐 Additional examination security

👩‍💻 Author
<p align="center">
Aditi Singh

<b>Full-Stack Developer • MERN Stack • AI Integration</b>

</p>
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
