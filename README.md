<div align="center">

# 🧠 AI EXAM PORTAL

### 🚀 Smart • Secure • AI-Powered • Full-Stack Examination Platform

**Create exams. Generate questions with AI. Conduct secure assessments.  
Evaluate performance. Analyze results.**

<br/>

![React](https://img.shields.io/badge/React-18%2B-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-22%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-API-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![AI](https://img.shields.io/badge/AI-Question%20Generation-A855F7?style=for-the-badge)

<br/>

[✨ Features](#-features) •
[🏗️ Architecture](#️-architecture) •
[🤖 AI](#-ai-powered-question-generation) •
[📸 Screenshots](#-screenshots) •
[⚙️ Setup](#️-installation) •
[🔌 APIs](#-api-modules)

</div>

---

# 🌟 What is AI Exam Portal?

> **AI Exam Portal** is a full-stack examination platform that combines
> **AI-assisted question generation, secure online examinations,
> automated evaluation, role-based access, and performance analytics**
> into one application.

The platform is designed around three major roles:

<div align="center">

| 👨‍🎓 STUDENT | 👨‍🏫 TEACHER | 🛡️ ADMIN |
|:---:|:---:|:---:|
| Attempt Exams | Create Exams | Manage Platform |
| View Results | Manage Questions | Administrative Access |
| Track Performance | AI Question Generation | User Management |
| View History | Analyze Results | Dashboard |

</div>

---

# 💎 Why This Project?

Traditional examination systems often require different tools for:

```text
Question Creation
       ↓
Exam Scheduling
       ↓
Exam Conducting
       ↓
Answer Evaluation
       ↓
Result Generation
       ↓
Performance Analysis
```

### 🚀 This project brings the complete workflow together:

```text
              🧠 AI
               │
               ▼
       📝 Question Creation
               │
               ▼
        📋 Exam Management
               │
               ▼
       ⏱️ Secure Examination
               │
               ▼
       🤖 Automated Evaluation
               │
               ▼
        📊 Result Analytics
               │
               ▼
        📈 Performance Insights
```

---

# ✨ Features

## 🤖 AI-Powered Features

| Feature | Description |
|---|---|
| 🧠 AI Question Generation | Generate questions using AI |
| 📚 Material-Based Generation | Generate questions from study material |
| 📝 Multiple Question Types | MCQ, True/False, Short & Detailed Answer |
| ⚡ Faster Exam Creation | Reduce manual question preparation |

---

## 🔐 Security & Authentication

- 🔑 JWT-based authentication
- 🛡️ Protected API routes
- 👥 Role-based authorization
- 🚫 Duplicate attempt prevention
- ⏰ Start/end time validation
- 🔒 Server-side exam validation
- 📌 Submission status validation

---

## 📝 Examination System

- 📋 Create examinations
- ➕ Add questions
- ✏️ Edit questions
- 🗑️ Delete questions
- 📢 Publish examinations
- 📅 Schedule examinations
- ⏱️ Timed examinations
- 🔢 Question navigation
- ⚡ Automatic submission
- 🚫 Prevent multiple attempts

---

## 📊 Evaluation & Analytics

- 🎯 Score calculation
- 📈 Percentage calculation
- ✅ Correct answers
- ❌ Wrong answers
- ⏭️ Skipped answers
- 🏆 Pass / Fail
- 📋 Student history
- 📊 Teacher analytics
- 🥇 Ranking / leaderboard

---

# 👨‍🎓 Student Experience

```text
┌───────────────┐
│   REGISTER    │
└───────┬───────┘
        ↓
┌───────────────┐
│     LOGIN     │
└───────┬───────┘
        ↓
┌───────────────┐
│   DASHBOARD   │
└───────┬───────┘
        ↓
┌───────────────┐
│ VIEW EXAMS    │
└───────┬───────┘
        ↓
┌───────────────┐
│  START EXAM   │
└───────┬───────┘
        ↓
┌───────────────┐
│ ANSWER Qs     │
└───────┬───────┘
        ↓
┌───────────────┐
│    SUBMIT     │
└───────┬───────┘
        ↓
┌───────────────┐
│     RESULT    │
└───────┬───────┘
        ↓
┌───────────────┐
│   ANALYTICS   │
└───────────────┘
```

---

# 👨‍🏫 Teacher Experience

```text
Login
  │
  ▼
🎓 Teacher Dashboard
  │
  ├───────────────┐
  ▼               ▼
Create Exam     AI Generate
  │               │
  │               ▼
  │          Review Questions
  │               │
  └───────┬───────┘
          ▼
     Add Questions
          │
          ▼
      Publish Exam
          │
          ▼
    Student Attempts
          │
          ▼
    📊 View Results
          │
          ▼
    📈 Analytics
```

---

# 🤖 AI-Powered Question Generation

### From Requirements

```text
👨‍🏫 Teacher
     │
     ▼
📋 Enter Requirements
     │
     ▼
🤖 AI Processing
     │
     ▼
🧠 Generated Questions
     │
     ▼
👀 Teacher Review
     │
     ▼
➕ Add To Exam
```

### From Study Material

```text
📚 Study Material
       │
       ▼
      📤
    Upload
       │
       ▼
   🤖 AI Engine
       │
       ▼
📝 Generated Questions
       │
       ▼
👨‍🏫 Teacher Review
       │
       ▼
   📋 Examination
```

---

# 🛡️ Secure Examination Flow

Important examination rules are validated on the backend.

```text
Student
   │
   ▼
Authentication
   │
   ▼
Is Exam Published?
   │
   ├── ❌ No → Reject
   │
   ▼
Is Start Time Valid?
   │
   ├── ❌ No → Reject
   │
   ▼
Is End Time Valid?
   │
   ├── ❌ No → Reject
   │
   ▼
Already Attempted?
   │
   ├── ✅ Yes → Reject
   │
   ▼
Start Examination
   │
   ▼
Submit Answers
   │
   ▼
Server-Side Evaluation
   │
   ▼
Generate Result
```

---

# 🧮 Evaluation System

After submission, the backend calculates:

```text
                    Student Answers
                          │
                          ▼
                   Question Matching
                          │
             ┌────────────┼────────────┐
             ▼            ▼            ▼
          Correct       Wrong       Skipped
             │            │            │
             └────────────┼────────────┘
                          ▼
                     Score
                          │
                          ▼
                     Percentage
                          │
                          ▼
                    Pass / Fail
                          │
                          ▼
                   Store Result
```

---

# 🏗️ Architecture

```text
                    ┌───────────────────────┐
                    │      FRONTEND         │
                    │       React           │
                    │                       │
                    │ Student │ Teacher     │
                    │ Admin   │ Results     │
                    └───────────┬───────────┘
                                │
                              Axios
                                │
                                ▼
                    ┌───────────────────────┐
                    │       BACKEND         │
                    │   Node + Express      │
                    │                       │
                    │ Routes                │
                    │ Controllers           │
                    │ Middleware            │
                    └───────────┬───────────┘
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
          ┌─────────────────┐     ┌─────────────────┐
          │    MongoDB      │     │    AI Service   │
          │                 │     │                 │
          │ Users           │     │ Question        │
          │ Exams           │     │ Generation      │
          │ Questions       │     │                 │
          │ Attempts        │     │                 │
          │ Results         │     │                 │
          └─────────────────┘     └─────────────────┘
```

---

# 🧰 Technology Stack

<div align="center">

### 🎨 Frontend

![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat-square&logo=reactrouter&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-1572B6?style=flat-square&logo=css3&logoColor=white)

### ⚙️ Backend

![Node](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![REST API](https://img.shields.io/badge/REST-API-8B5CF6?style=flat-square)

### 🗄️ Database

![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=flat-square&logo=mongoose&logoColor=white)

### 🔐 Security

![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)

### 🤖 AI

![AI](https://img.shields.io/badge/AI-Powered-A855F7?style=flat-square)

</div>

---

# 📁 Project Structure

```text
AI-Exam-Portal/
│
├── 📂 backend/
│   ├── 📂 config/
│   ├── 📂 controllers/
│   ├── 📂 middleware/
│   ├── 📂 models/
│   ├── 📂 routes/
│   ├── 📄 createAdmin.js
│   ├── 📄 server.js
│   └── 📄 package.json
│
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   ├── 📂 pages/
│   │   ├── 📂 services/
│   │   ├── 📂 styles/
│   │   └── 📄 App.jsx
│   └── 📄 package.json
│
├── 📂 Screenshots/
│
├── 📄 README.md
└── 📄 .gitignore
```

---

# 📸 Screenshots

<div align="center">

### 👨‍🎓 Student Dashboard

<img src="Screenshots/student-dashboard.png" width="90%">

---

### 📝 Available Examinations

<img src="Screenshots/Exams.png" width="90%">

---

### 👨‍🏫 Teacher Dashboard

<img src="Screenshots/teacherDashboard.png" width="90%">

---

### 📊 Teacher Analytics

<img src="Screenshots/teacher%20analyzing.png" width="90%">

---

### 📋 Examination Result

<img src="Screenshots/result.png" width="90%">

---

### 🏆 Leaderboard

<img src="Screenshots/leaderboard.png" width="90%">

</div>

---

# 🔌 API Modules

| API Module | Purpose |
|---|---|
| 🔐 Authentication | Registration & Login |
| 📝 Exams | Create & Manage Exams |
| ❓ Questions | Question Management |
| 🧑‍💻 Attempts | Start & Submit Exams |
| 📊 Results | Result Management |
| 📈 Dashboard | Statistics |
| 🤖 AI | AI Question Generation |
| 🛡️ Admin | Administrative Operations |

---

# ⚙️ Installation

## 1️⃣ Clone

```bash
git clone https://github.com/AditiRaySingh/AI-Exam-Portal.git
cd AI-Exam-Portal
```

---

## 2️⃣ Backend

```bash
cd backend
npm install
npm run dev
```

Create:

```text
backend/.env
```

Example:

```env
PORT=3000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
AI_API_KEY=your_ai_api_key
```

---

## 3️⃣ Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

---

# 🔒 Environment Variables

⚠️ **Never upload real secrets to GitHub.**

Do NOT commit:

```text
.env
API keys
MongoDB credentials
JWT secrets
Private credentials
```

Use environment variables locally.

---

# 🧪 Testing

The application can be tested using Postman and through the complete frontend workflow.

### Core Test Flow

```text
Authentication
      ↓
Create Exam
      ↓
Add Questions
      ↓
Publish Exam
      ↓
Student Starts Exam
      ↓
Answer Questions
      ↓
Submit
      ↓
Evaluate
      ↓
Generate Result
      ↓
Teacher Analytics
```

---

# 📈 Future Roadmap

| Feature | Status |
|---|:---:|
| Authentication | ✅ |
| Student Dashboard | ✅ |
| Teacher Dashboard | ✅ |
| Admin Dashboard | ✅ |
| Exam Management | ✅ |
| AI Question Generation | ✅ |
| Material-Based Generation | ✅ |
| Automated Evaluation | ✅ |
| Result Analytics | ✅ |
| Leaderboard | ✅ |
| Advanced Proctoring | 🔜 |
| Face Verification | 🔜 |
| Email Notifications | 🔜 |
| Mobile Application | 🔜 |

---

# 🎯 Project Highlights

<div align="center">

### 🤖 AI

**Reduce manual question creation**

### 🔐 SECURITY

**Protected role-based examination workflow**

### 📝 EXAMS

**Complete examination lifecycle**

### 📊 ANALYTICS

**Data-driven student performance**

### ⚡ FULL STACK

**React + Node.js + Express + MongoDB**

### 🎨 MODERN UI

**Responsive SaaS-style interface**

</div>

---

# 💡 What Makes It Different?

```text
       Traditional Exam System
                 │
       ┌─────────┴─────────┐
       │                   │
   Exam Creation       Evaluation
       │                   │
       └─────────┬─────────┘
                 │
              Manual
                 │
                 ▼
           More Effort
```

### 🚀 AI Exam Portal

```text
       ┌─────────────────────────┐
       │       AI ASSISTANCE     │
       └────────────┬────────────┘
                    │
                    ▼
             Question Creation
                    │
                    ▼
             Exam Management
                    │
                    ▼
           Secure Examination
                    │
                    ▼
          Automated Evaluation
                    │
                    ▼
            Result Analytics
```

---

# 👩‍💻 Author

<div align="center">

## Aditi Ray Singh

### 💻 Full-Stack Developer

**React • JavaScript • Node.js • Express.js • MongoDB • REST APIs • AI**

</div>

---

<div align="center">

# ⭐ AI Exam Portal

### Build • Learn • Test • Analyze 🚀

**Thank you for visiting the project!**

⭐ **If you like this project, consider starring the repository.**

</div>
