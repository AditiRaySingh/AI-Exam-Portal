<div align="center">

# 🧠 AI Exam Portal

### AI-Powered Full-Stack Online Examination Platform

<p>
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
</p>

<p>
  <img src="https://img.shields.io/badge/JWT-Authentication-8A2BE2?style=for-the-badge" />
  <img src="https://img.shields.io/badge/AI-Question%20Generation-FF1493?style=for-the-badge" />
  <img src="https://img.shields.io/badge/AI-Answer%20Evaluation-9B59B6?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Responsive-UI-7C3AED?style=for-the-badge" />
</p>

<p>
  <b>A modern full-stack examination platform built with the MERN stack</b><br/>
  combining online assessments, AI-assisted question generation,<br/>
  answer evaluation, role-based access, and performance analytics.
</p>

</div>


## 📌 Project Overview

**AI Exam Portal** is a full-stack online examination platform designed for **students, teachers, and administrators**.

The system manages the complete examination lifecycle, from exam creation and question management to student attempts, evaluation, results, and analytics.

The platform also integrates AI into the examination workflow to reduce manual effort for teachers and assist with question generation and answer evaluation.

### Main Objectives

- Provide an interactive online examination experience
- Simplify exam creation and question management
- Reduce teacher effort through AI-assisted question generation
- Generate questions from uploaded study material
- Evaluate student answers efficiently
- Provide detailed examination results and analytics
- Implement secure authentication and role-based authorization
- Prevent duplicate attempts and unauthorized exam access


## ⭐ Core Features

### 🎓 Student Features

| Feature | Description |
|---|---|
| Authentication | Secure registration and login |
| Exam Dashboard | View available published examinations |
| Online Examination | Attempt exams through an interactive interface |
| Timer | Track remaining examination time |
| Question Navigation | Move between examination questions |
| Answer Submission | Submit examination answers |
| Results | View score, percentage, and result status |
| History | View previous examination attempts |
| Attempt Protection | Prevent duplicate attempts for the same exam |


### 👨‍🏫 Teacher Features

| Feature | Description |
|---|---|
| Exam Creation | Create and configure examinations |
| Question Management | Add and manage questions |
| AI Question Generation | Generate questions using AI |
| Material-Based Generation | Generate questions from study material |
| Question Review | Review and modify generated questions |
| Exam Publishing | Publish exams for students |
| Student Results | View student examination results |
| Analytics | Analyze student performance |
| Attempt Statistics | Track students and examination attempts |


### 🛡️ Admin Features

| Feature | Description |
|---|---|
| User Management | Manage platform users |
| Student Management | Monitor student accounts |
| Teacher Management | Monitor teacher accounts |
| Dashboard | View platform statistics |
| Platform Administration | Manage examination-related operations |


## 🤖 AI Capabilities

AI is integrated into the actual examination workflow to assist teachers with question creation and answer evaluation.

### AI Question Generation

Teachers can use AI to generate examination questions instead of creating every question manually.

The workflow is:

**Study Material → AI Processing → Generated Questions → Teacher Review → Examination**

### AI Features

- AI-assisted question generation
- Material-based question generation
- AI-assisted answer evaluation
- Teacher review before generated questions are used
- Faster examination preparation

> AI assists the teacher while keeping the final question review under teacher control.


## 🔄 Examination Workflow

The platform supports the complete examination lifecycle:

**Teacher**

Create Exam  
↓  
Add Questions / Generate Questions with AI  
↓  
Review Questions  
↓  
Publish Exam  

**Student**

View Published Exam  
↓  
Start Exam  
↓  
Answer Questions  
↓  
Submit Exam  

**System**

Evaluate Answers  
↓  
Calculate Score  
↓  
Generate Result  
↓  
Update Performance Analytics


## 🏗️ System Architecture

The application follows a full-stack client-server architecture.

### Frontend

The React frontend provides the user interface for students, teachers, and administrators.

### Backend

The Node.js and Express.js backend provides REST APIs for authentication, examinations, questions, attempts, results, dashboards, administration, and AI functionality.

### Database

MongoDB stores users, examinations, questions, attempts, results, and related application data.

### AI Layer

The AI integration supports question generation, material-based generation, and answer evaluation.

### Architecture Overview

React Frontend
      │
      ▼
REST API
      │
      ▼
Node.js + Express.js
      │
      ├── Authentication
      ├── Exam Management
      ├── Question Management
      ├── Exam Attempts
      ├── Results
      ├── Dashboard
      ├── Admin
      └── AI Services
              │
              ▼
          AI Provider
              
Node.js + Express.js
      │
      ▼
MongoDB
👥 Role-Based System

The application provides different functionality according to the authenticated user's role.

Student
Login
  ↓
View Available Exams
  ↓
Start Examination
  ↓
Answer Questions
  ↓
Submit Examination
  ↓
View Result
  ↓
View History
Teacher
Login
  ↓
Teacher Dashboard
  ↓
Create Examination
  ↓
Add / Generate Questions
  ↓
Review Questions
  ↓
Publish Examination
  ↓
View Results
  ↓
Analyze Performance
Admin
Login
  ↓
Admin Dashboard
  ↓
Manage Users
  ↓
Monitor Platform
  ↓
Manage Examination System
📸 Screenshots
🎓 Student Dashboard
<p align="center"> <img src="Screenshots/student-dashboard.png" width="90%" alt="Student Dashboard" /> </p>
📝 Available Exams
<p align="center"> <img src="Screenshots/Exams.png" width="90%" alt="Available Exams" /> </p>
👨‍🏫 Teacher Dashboard
<p align="center"> <img src="Screenshots/teacherDashboard.png" width="90%" alt="Teacher Dashboard" /> </p>
📊 Teacher Analytics
<p align="center"> <img src="Screenshots/teacher%20analyzing.png" width="90%" alt="Teacher Analytics" /> </p>
🏆 Examination Results
<p align="center"> <img src="Screenshots/result.png" width="90%" alt="Examination Results" /> </p>
🏅 Leaderboard
<p align="center"> <img src="Screenshots/leaderboard.png" width="90%" alt="Leaderboard" /> </p>
📊 Dashboard & Analytics

The application provides dedicated dashboards based on user roles.

Student Dashboard

Students can access:

Available examinations
Examination attempts
Results
Performance information
Examination history
Teacher Dashboard

Teachers can view:

Total examinations
Total students
Total attempts
Created examinations
AI question generation
Material-based question generation
Student results
Performance analytics
Admin Dashboard

Administrators can access:

User management
Student management
Teacher management
Platform statistics
Administrative operations
🛠️ Technology Stack
Frontend
<p> <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" /> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" /> <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" /> <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" /> </p>
React
JavaScript
CSS
Axios
React Router
Backend
<p> <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" /> <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" /> </p>
Node.js
Express.js
REST APIs
JWT Authentication
Role-Based Authorization
Middleware
Database
<p> <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" /> <img src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white" /> </p>
MongoDB
Mongoose
AI
AI question generation
Material-based question generation
AI-assisted answer evaluation
📁 Project Structure
AI-Exam-Portal/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── services/
│   │   ├── assets/
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── Screenshots/
│
├── .gitignore
└── README.md
🔐 Security & Authentication

The application uses JWT-based authentication and role-based authorization to control access to protected resources.

Authentication
User
  ↓
Register / Login
  ↓
JWT Token
  ↓
Authenticated Request
  ↓
Protected Route
  ↓
Role Authorization
  ↓
Requested Resource
Security Features
JWT-based authentication
Protected API routes
Role-based authorization
Teacher and student route separation
Protected examination endpoints
Duplicate examination attempt protection
Examination timing validation
Correct answers hidden from students during the examination
Secure answer submission
📡 API Modules
Endpoint	Purpose
/api/auth	Authentication and registration
/api/exams	Examination management
/api/questions	Question management
/api/exam-attempts	Exam attempts and submission
/api/dashboard	Dashboard information
/api/ai/material	Material-based AI generation
/api/ai/question	AI question generation
/api/ai/evaluation	AI answer evaluation
/api/results	Result management
/api/admin	Administrative operations
📈 Examination Evaluation

The examination system records and calculates multiple performance metrics.

Metric	Description
Score	Marks obtained by the student
Percentage	Overall examination percentage
Correct	Number of correct answers
Wrong	Number of incorrect answers
Skipped	Number of unanswered questions
Result	Pass or Fail
Time Taken	Time spent during examination
Attempt Status	Current state of the examination attempt
🚀 Installation & Setup
1. Clone the Repository
git clone https://github.com/AditiRaySingh/AI-Exam-Portal.git
cd AI-Exam-Portal
2. Backend Setup
cd backend
npm install
npm start
3. Frontend Setup

Open another terminal:

cd frontend
npm install
npm run dev
🔑 Environment Variables

Create a .env file inside the backend directory.

PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_ai_api_key

Never commit .env files, database credentials, JWT secrets, or AI API keys to GitHub.

🌐 Local Development

Once the application is running:

Frontend
http://localhost:5173
Backend
http://localhost:3000
🧪 Examination Process

A typical examination flow is:

1. Register / Login
2. Access role-specific dashboard
3. Teacher creates examination
4. Teacher adds or generates questions
5. Teacher reviews questions
6. Teacher publishes examination
7. Student views published examination
8. Student starts examination
9. Student answers questions
10. Student submits examination
11. System evaluates answers
12. Result is generated
13. Performance data is available for analysis
💡 Engineering Highlights
Area	Implementation
Frontend	React-based responsive interface
Backend	Node.js + Express REST APIs
Database	MongoDB with Mongoose
Authentication	JWT
Authorization	Role-based access control
Examination	Complete exam lifecycle
AI	Question generation and answer evaluation
Question Management	Manual and AI-assisted
Evaluation	Score, percentage, correct, wrong, skipped
Analytics	Student and teacher performance data
Security	Protected routes and attempt control
UI	Responsive dark-themed interface
🗺️ Future Improvements

Potential future enhancements include:

Email notifications
Real-time notifications
Advanced analytics
Enhanced AI evaluation
Advanced leaderboard functionality
Progressive Web App support
Improved cloud deployment
Additional examination security features
👩‍💻 Author
<div align="center">
Aditi Singh

Full-Stack Developer | MERN Stack | AI Integration

<p> <img src="https://img.shields.io/badge/MERN-Developer-8A2BE2?style=for-the-badge" /> <img src="https://img.shields.io/badge/React-Developer-61DAFB?style=for-the-badge&logo=react&logoColor=black" /> <img src="https://img.shields.io/badge/Node.js-Developer-339933?style=for-the-badge&logo=node.js&logoColor=white" /> </p> </div>
⭐ Support

If you find this project interesting:

⭐ Star the repository
🍴 Fork the repository
💡 Share feedback
🚀 Explore the project
<div align="center">
🧠 AI Exam Portal

AI-Assisted Examination • Secure Access • Performance Analytics

Built with ❤️ using the MERN Stack

</div> 
