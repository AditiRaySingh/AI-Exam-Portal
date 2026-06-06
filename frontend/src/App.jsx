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

   </Routes>


  </BrowserRouter>
 );
}

export default App;