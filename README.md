<div align="center">

# 🧠 AI EXAM PORTAL

### 🚀 Smart • Secure • AI-Powered Examination Platform

<p>
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-API-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
</p>

<p>
  <img src="https://img.shields.io/badge/JWT-Authentication-8A2BE2?style=for-the-badge" />
  <img src="https://img.shields.io/badge/AI-Powered-FF1493?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Responsive-UI-9B59B6?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Status-Active-22C55E?style=for-the-badge" />
</p>

<br />

**A modern full-stack examination platform built with MERN Stack and AI.**

<br />

[✨ Features](#-features) •
[🤖 AI](#-ai-capabilities) •
[🏗️ Architecture](#️-architecture) •
[📸 Screenshots](#-screenshots) •
[🛠️ Tech Stack](#️-technology-stack) •
[🚀 Installation](#-installation)

</div>

---

# 📖 Overview

**AI Exam Portal** is a full-stack online examination platform designed to make
online assessments more **efficient, secure, intelligent, and user-friendly**.

The platform provides dedicated workflows for:

- 🎓 **Students** — attempt exams and track results
- 👨‍🏫 **Teachers** — create, manage, publish, and analyze exams
- 🛡️ **Admins** — manage users and the examination platform
- 🤖 **AI** — assist with question generation and evaluation

The system combines:

> 🧠 AI Assistance + 📝 Online Examination + 📊 Analytics + 🔐 Secure Authentication

into one complete platform.

---

# ✨ Features

## 🎓 Student Features

| Feature | Description |
|---|---|
| 🔐 Authentication | Secure registration and login |
| 📚 Exam Dashboard | View available examinations |
| 📝 Online Exam | Attempt questions through an interactive interface |
| ⏱️ Timer | Track remaining examination time |
| 🧭 Question Navigation | Navigate through examination questions |
| 📤 Exam Submission | Submit answers securely |
| 🏆 Results | View score and examination result |
| 📊 Performance | Track examination history |
| 🔒 Attempt Protection | Prevent duplicate exam attempts |

---

## 👨‍🏫 Teacher Features

| Feature | Description |
|---|---|
| 📝 Create Exam | Create and configure examinations |
| ❓ Add Questions | Add questions manually |
| 🤖 AI Generation | Generate questions using AI |
| 📚 Material Upload | Generate questions from study material |
| ✏️ Edit Questions | Review and modify questions |
| 🚀 Publish Exam | Publish examinations for students |
| 📊 Results | View student examination results |
| 📈 Analytics | Analyze student performance |
| 👥 Student Statistics | Track students and attempts |

---

## 🛡️ Admin Features

| Feature | Description |
|---|---|
| 👥 User Management | Manage platform users |
| 🎓 Student Management | Monitor students |
| 👨‍🏫 Teacher Management | Monitor teachers |
| 📊 Dashboard | View platform statistics |
| ⚙️ Platform Management | Manage examination system |

---

# 🤖 AI Capabilities

AI is integrated into the actual examination workflow to assist teachers
with question creation and answer evaluation.

## 🧠 AI Question Generation


📚 Study Material
       │
       ▼
🤖 AI Processing
       │
       ▼
🧠 Question Generation
       │
       ▼
✏️ Teacher Review
       │
       ▼
📝 Add to Examination
       │
       ▼
🚀 Publish
AI Features
🤖 AI-assisted question generation
📚 Generate questions from study material
🧠 AI-assisted answer evaluation
✏️ Teacher review before using generated questions
⚡ Faster examination preparation

💡 AI assists the teacher while keeping the final review under teacher control.

🔄 Examination Workflow
                    👨‍🏫 TEACHER
                         │
                         ▼
                   📝 CREATE EXAM
                         │
              ┌──────────┴──────────┐
              │                     │
              ▼                     ▼
      ✍️ Manual Questions     🤖 AI Questions
              │                     │
              └──────────┬──────────┘
                         ▼
                    ✏️ REVIEW
                         │
                         ▼
                   🚀 PUBLISH
                         │
                         ▼
                    🎓 STUDENT
                         │
                         ▼
                   📝 START EXAM
                         │
                         ▼
                ⏱️ ANSWER QUESTIONS
                         │
                         ▼
                     📤 SUBMIT
                         │
                         ▼
                  🧠 EVALUATION
                         │
                         ▼
                    🏆 RESULT
                         │
                         ▼
                   📊 ANALYTICS
🏗️ Architecture
                         🌐 USER
                           │
                           ▼
                  ⚛️ REACT FRONTEND
                           │
                           ▼
                     🔐 JWT AUTH
                           │
                           ▼
                    🚀 REST APIs
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
        🎓 STUDENT     👨‍🏫 TEACHER     🛡️ ADMIN
             │             │             │
             └─────────────┼─────────────┘
                           │
                           ▼
                     🟢 NODE.JS
                           │
                           ▼
                    ⚡ EXPRESS.JS
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
        🍃 MONGODB       🤖 AI       📊 RESULTS
👥 Role-Based System
🎓 Student
Login
  ↓
View Available Exams
  ↓
Start Exam
  ↓
Answer Questions
  ↓
Submit Exam
  ↓
View Result
  ↓
View History
👨‍🏫 Teacher
Login
  ↓
Teacher Dashboard
  ↓
Create Exam
  ↓
Add / Generate Questions
  ↓
Review Questions
  ↓
Publish Exam
  ↓
View Results
  ↓
Analyze Performance
🛡️ Admin
Login
  ↓
Admin Dashboard
  ↓
Manage Users
  ↓
Monitor Platform
  ↓
Manage Examination System
📊 Dashboard

The platform provides role-specific dashboards.

🎓 Student Dashboard

Provides access to:

📚 Available exams
📝 Examination attempts
🏆 Results
📊 Performance
📈 Examination history
👨‍🏫 Teacher Dashboard

Provides:

📝 Total Exams
👥 Total Students
📊 Total Attempts
➕ Create Exam
🤖 AI Question Generation
📚 Material Upload
📈 Analytics
🏆 Student Results
🛡️ Admin Dashboard

Provides:

👥 User management
🎓 Student management
👨‍🏫 Teacher management
📊 Platform statistics
⚙️ Platform administration
📸 Screenshots
🎓 Student Dashboard
<p align="center"> <img src="Screenshots/student-dashboard.png" width="90%" alt="Student Dashboard" /> </p>
📝 Exams
<p align="center"> <img src="Screenshots/Exams.png" width="90%" alt="Exams" /> </p>
👨‍🏫 Teacher Dashboard
<p align="center"> <img src="Screenshots/teacherDashboard.png" width="90%" alt="Teacher Dashboard" /> </p>
📊 Teacher Analytics
<p align="center"> <img src="Screenshots/teacher%20analyzing.png" width="90%" alt="Teacher Analytics" /> </p>
🏆 Results
<p align="center"> <img src="Screenshots/result.png" width="90%" alt="Results" /> </p>
🏅 Leaderboard
<p align="center"> <img src="Screenshots/leaderboard.png" width="90%" alt="Leaderboard" /> </p>
🛠️ Technology Stack
🎨 Frontend
<p> <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" /> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" /> <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" /> <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" /> </p>
⚛️ React
🟨 JavaScript
🎨 CSS
🌐 Axios
🧭 React Router
⚙️ Backend
<p> <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" /> <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" /> </p>
🟢 Node.js
⚡ Express.js
🔐 JWT Authentication
🛡️ Middleware
📡 REST APIs
🗄️ Database
<p> <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" /> <img src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white" /> </p>
🍃 MongoDB
🔗 Mongoose
🤖 AI Integration
<p> <img src="https://img.shields.io/badge/AI%20Integration-8A2BE2?style=for-the-badge" /> <img src="https://img.shields.io/badge/LLM%20Powered-FF1493?style=for-the-badge" /> </p>

AI is used for:

🧠 Question generation
📚 Material-based question generation
📝 Answer evaluation
📁 Project Structure
AI-Exam-Portal/
│
├── 📂 frontend/
│   ├── 📂 public/
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   ├── 📂 pages/
│   │   ├── 📂 styles/
│   │   ├── 📂 services/
│   │   ├── 📂 assets/
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── 📂 backend/
│   ├── 📂 config/
│   ├── 📂 controllers/
│   ├── 📂 middleware/
│   ├── 📂 models/
│   ├── 📂 routes/
│   ├── 📂 services/
│   ├── 📂 utils/
│   ├── server.js
│   └── package.json
│
├── 📂 Screenshots/
│
├── 📄 .gitignore
└── 📄 README.md
🔐 Security

The platform uses authentication and role-based authorization.

🔑 Authentication Flow
👤 User
   │
   ▼
🔐 Login / Register
   │
   ▼
🎫 JWT Token
   │
   ▼
🛡️ Protected Routes
   │
   ▼
🎭 Role Authorization
   │
   ├───────────────┬───────────────┐
   ▼               ▼               ▼
🎓 Student     👨‍🏫 Teacher      🛡️ Admin
🛡️ Examination Protection

The system includes:

🔒 Protected exam routes
👤 Role-based access
🚫 Duplicate attempt protection
⏱️ Exam timing validation
📝 Secure submission
🔐 Hidden correct answers during examination
📡 API Modules
Endpoint	Purpose
/api/auth	🔐 Authentication and registration
/api/exams	📝 Exam management
/api/questions	❓ Question management
/api/exam-attempts	📤 Exam attempts and submission
/api/dashboard	📊 Dashboard data
/api/ai/material	📚 Material-based AI generation
/api/ai/question	🤖 AI question generation
/api/ai/evaluation	🧠 AI evaluation
/api/results	🏆 Result management
/api/admin	🛡️ Admin operations
📈 Result & Evaluation

The examination system calculates:

Metric	Description
🎯 Score	Marks obtained by the student
📊 Percentage	Overall examination percentage
✅ Correct	Number of correct answers
❌ Wrong	Number of incorrect answers
⏭️ Skipped	Number of unanswered questions
🏆 Result	Pass / Fail
⏱️ Time Taken	Time spent during examination
🚀 Installation
1. Clone Repository
git clone https://github.com/AditiRaySingh/AI-Exam-Portal.git
cd AI-Exam-Portal
2. Backend Setup
cd backend

Install dependencies:

npm install

Start backend:

npm start
3. Frontend Setup

Open a new terminal:

cd frontend

Install dependencies:

npm install

Start frontend:

npm run dev
🔑 Environment Variables

Create a .env file inside the backend directory.

PORT=3000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GROQ_API_KEY=your_ai_api_key

⚠️ Never commit .env files or API keys to GitHub.

🌐 Local Development

After starting the application:

Frontend
http://localhost:5173

Backend
http://localhost:3000
🧪 Examination Process
1. 👤 Register / Login
          ↓
2. 🎭 Select User Role
          ↓
3. 👨‍🏫 Teacher Creates Exam
          ↓
4. ❓ Add Questions
          ↓
5. 🤖 Generate Questions with AI
          ↓
6. ✏️ Review Questions
          ↓
7. 🚀 Publish Exam
          ↓
8. 🎓 Student Starts Exam
          ↓
9. 📝 Student Answers Questions
          ↓
10. 📤 Submit Exam
          ↓
11. 🧠 Evaluation
          ↓
12. 🏆 Result Generated
          ↓
13. 📊 Performance Analytics
💎 Project Highlights
<div align="center">
🧩 Area	🚀 Implementation
⚛️ Frontend	React
🟢 Backend	Node.js + Express
🍃 Database	MongoDB
🔐 Authentication	JWT
👥 Authorization	Role-Based Access
🤖 AI	AI-Assisted Generation & Evaluation
📝 Examination	Complete Exam Lifecycle
📊 Analytics	Student & Teacher Analytics
🎨 UI	Modern Responsive Interface
🛡️ Security	Protected Routes & Attempt Control
</div>
🗺️ Future Roadmap
 📧 Email notifications
 🔔 Real-time notifications
 📊 Advanced analytics
 🧠 Enhanced AI evaluation
 🏆 Advanced leaderboard
 📱 Progressive Web App
 ☁️ Improved cloud deployment
 🛡️ Additional examination security
👩‍💻 Author
<div align="center">
Aditi Singh
💜 Full-Stack Developer | MERN Stack | AI Integration
<p> <img src="https://img.shields.io/badge/MERN%20Stack-Developer-8A2BE2?style=for-the-badge" /> <img src="https://img.shields.io/badge/React-Developer-61DAFB?style=for-the-badge&logo=react&logoColor=black" /> <img src="https://img.shields.io/badge/Node.js-Developer-339933?style=for-the-badge&logo=node.js&logoColor=white" /> </p> </div>
⭐ Support

If you like this project:

⭐ Star the repository

🍴 Fork the repository

💡 Share feedback

🚀 Explore the project

<div align="center">
💜 BUILT WITH MERN + AI
🚀 Smart Examination. Secure Assessment. Better Analytics.

Thank you for visiting!

</div>
