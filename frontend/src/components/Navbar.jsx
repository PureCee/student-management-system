import { useState, useContext } from "react";

import { NavLink, useNavigate, useLocation } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { student, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  // Hide the global navbar on the student dashboard
  if (location.pathname === "/dashboard") {
    return null;
  }

 // Handle logout with confirmation
const handleLogout = () => {
  const confirmLogout = window.confirm(
    "Are you sure you want to log out?"
  );

  if (confirmLogout) {
    logout();

    setMenuOpen(false);

    navigate("/login");
  }
};

  // Close mobile menu after navigation
  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      {/* LOGO */}

      <div className="navbar-logo">
        <NavLink to="/register">
          Edu<span>Smart</span>
        </NavLink>
      </div>

      {/* MOBILE MENU BUTTON */}

      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation"
        aria-expanded={menuOpen}
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      {/* NAVIGATION LINKS */}
      <nav className={`navbar-links ${menuOpen ? "active" : ""}`}>
        {/* ADMIN NAVIGATION */}
        {student?.role === "admin" ? (
          <>
            <NavLink
              to="/admin-dashboard"
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive ? "nav-link active-link" : "nav-link"
              }
            >
              Dashboard
            </NavLink>

            {/* ADMIN PROFILE */}
            <div className="navbar-student">
              <span className="student-avatar">
                {student.firstName?.charAt(0).toUpperCase() || "A"}
              </span>

              <span className="student-name">{student.firstName}</span>
            </div>

            <button className="navbar-logout" onClick={handleLogout}>
              Log Out
            </button>
          </>
        ) : !student ? (
          /* PUBLIC NAVIGATION */
          <>
            <NavLink
              to="/register"
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive ? "nav-link active-link" : "nav-link"
              }
            >
              Registration
            </NavLink>

            <NavLink
              to="/login"
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive ? "nav-link active-link" : "nav-link"
              }
            >
              Login
            </NavLink>
          </>
        ) : (
          /* STUDENT NAVIGATION */
          <>
            <NavLink
              to="/dashboard"
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive ? "nav-link active-link" : "nav-link"
              }
            >
              Dashboard
            </NavLink>

            <div className="navbar-student">
              <span className="student-avatar">
                {student.firstName?.charAt(0).toUpperCase()}
              </span>

              <span className="student-name">{student.firstName}</span>
            </div>

            <button className="navbar-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
