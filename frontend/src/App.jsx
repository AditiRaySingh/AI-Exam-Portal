import {
 BrowserRouter,
 Routes,
 Route
} from "react-router-dom";

import ResultPage
from "./pages/ResultPage";

import StudentDashboard
from "./pages/StudentDashboard";

import TeacherDashboard
from "./pages/TeacherDashboard";



import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ExamPage from "./pages/ExamPage";

import TeacherResults
from "./pages/TeacherResults";

import AddQuestion from "./pages/AddQuestion";

import CreateExam from "./pages/CreateExam";

import AIGenerate from "./pages/AIGenerate";
import ManageQuestions
from "./pages/ManageQuestions";

import EditQuestion from "./pages/EditQuestion";
import GenerateFromMaterial
from "./pages/GenerateFromMaterial";
import StudentResults from "./pages/StudentResults";


import SubjectiveEvaluation
from "./pages/SubjectiveEvaluation";

function App() {
 return (
  <BrowserRouter>

   <Routes>

    <Route
     path="/"
     element={<Login />}
    />

    <Route
     path="/register"
     element={<Register />}
    />

    <Route
  path="/student-dashboard"
  element={<StudentDashboard/>}
 />

 <Route
  path="/teacher-dashboard"
  element={<TeacherDashboard/>}
 />



   <Route
 path="/exam"
 element={<ExamPage/>}
/>


<Route
 path="/result/:examId"
 element={<ResultPage/>}
/>

<Route
  path="/teacher-results/:examId"
  element={<TeacherResults/>}
/>


<Route
 path="/add-question/:examId"
 element={<AddQuestion/>}
/>


<Route
  path="/create-exam"
  element={<CreateExam />}
/>


<Route
  path="/ai-generate"
  element={<AIGenerate />}
/>


<Route
  path="/questions/:examId"
  element={<ManageQuestions />}
/>


<Route
  path="/edit-question/:id"
  element={<EditQuestion />}
/>

<Route
 path="/generate-material"
 element={<GenerateFromMaterial />}
/>


<Route
 path="/evaluate"
 element={<SubjectiveEvaluation/>}
/>



<Route
 path="/student-results"
 element={<StudentResults />}
/>
   </Routes>


  </BrowserRouter>
 );
}

export default App;