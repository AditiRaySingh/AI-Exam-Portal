import "../styles/navbar.css";

function Navbar() {

 const user =
 JSON.parse(
  localStorage.getItem(
   "user"
  )
 );

 return (

  <nav className="navbar">

   {/* Left */}
   <div className="nav-left">

    <div className="logo-box">
      🎓
    </div>

    <h2>
      ExamPortal
    </h2>

   </div>

   {/* Center */}
   <div className="nav-center">

    <button
     className="nav-btn active"
    >
      Dashboard
    </button>

    <button
     className="nav-btn"
    >
      My Results
    </button>

   </div>

   {/* Right */}
   <div className="nav-right">

    <div className="profile-circle">

      {user?.name?.charAt(0)}

    </div>

    <p>
      {user?.name}
    </p>

   </div>

  </nav>
 );
}

export default Navbar;