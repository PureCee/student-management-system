import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ChangePassword from "./ChangePassword";
import MyProfile from "./MyProfile";

function Dashboard() {
  const { student, logout } = useContext(AuthContext);

  const [activeSection, setActiveSection] = useState("Overview");

  const menuItems = [
    { name: "Overview", icon: "🏠" },
    { name: "My Profile", icon: "👤" },
    { name: "Change Password", icon: "🔐" },
    // { name: "Register Courses", icon: "📝" },
    // { name: "My Courses", icon: "📚" },
    // { name: "Timetable", icon: "📅" },
    // { name: "Results", icon: "📊" },  
    // { name: "Notifications", icon: "🔔" },
  ];

  const navigate = useNavigate();

const handleLogout = () => {
  const confirmLogout = window.confirm(
    "Are you sure you want to log out?"
  );

  if (confirmLogout) {
    logout();
    navigate("/login");
  }
};

  return (
    <div className="student-portal">
      {/* LEFT SIDEBAR */}

      <aside className="student-sidebar">
        <div className="portal-brand">
          <h2>EduSmart</h2>
          <span>STUDENT PORTAL</span>
        </div>

        <div className="sidebar-profile">
          <div className="profile-avatar">
            {student?.firstName?.charAt(0)?.toUpperCase() || "S"}
          </div>

          <h3>
            {student?.firstName} {student?.lastName}
          </h3>

          <p>Student</p>
        </div>

        <nav className="sidebar-menu">
          <p className="menu-heading">MAIN MENU</p>

          {menuItems.map((item) => (
            <button
              key={item.name}
              className={
                activeSection === item.name
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
              onClick={() => setActiveSection(item.name)}
            >
              <span>{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <button className="sidebar-logout" onClick={handleLogout}>
          <span>↪</span>
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}

      <main className="student-main">
        <header className="portal-header">
          <div>
            <span className="portal-subtitle">STUDENT PORTAL</span>

            <h2>{activeSection}</h2>
          </div>

          <div className="header-user">
            <div className="header-avatar">
              {student?.firstName?.charAt(0)?.toUpperCase() || "S"}
            </div>

            <div>
              <strong>
                {student?.firstName} {student?.lastName}
              </strong>

              <p>Student Account</p>
            </div>
          </div>
        </header>

        {activeSection === "Overview" ? (
          <>
            {/* WELCOME SECTION */}

            <section className="portal-welcome">
              <div>
                <span>WELCOME BACK</span>

                <h1>Hello, {student?.firstName}!</h1>

                <p>
                  Welcome to your EduSmart student portal. Your academic journey
                  starts here.
                </p>
              </div>

              <div className="welcome-icon">🎓</div>
            </section>

            {/* ACADEMIC STATISTICS */}

            <section className="academic-stats">
              <div className="academic-card">
                <div className="stat-icon blue">📚</div>

                <div>
                  <p>Registered Courses</p>
                  <h2>—</h2>
                </div>
              </div>

              <div className="academic-card">
                <div className="stat-icon green">📊</div>

                <div>
                  <p>Current GPA</p>
                  <h2>—</h2>
                </div>
              </div>

              <div className="academic-card">
                <div className="stat-icon orange">📅</div>

                <div>
                  <p>Upcoming Classes</p>
                  <h2>—</h2>
                </div>
              </div>

              <div className="academic-card">
                <div className="stat-icon purple">🔔</div>

                <div>
                  <p>Notifications</p>
                  <h2>0</h2>
                </div>
              </div>
            </section>

            {/* LOWER DASHBOARD CONTENT */}

            <section className="portal-grid">
              <div className="portal-panel">
                <div className="panel-heading">
                  <h3>Student Information</h3>
                  <span>PROFILE</span>
                </div>

                <div className="profile-information">
                  <div>
                    <label>First Name</label>
                    <p>{student?.firstName || "Not available"}</p>
                  </div>

                  <div>
                    <label>Last Name</label>
                    <p>{student?.lastName || "Not available"}</p>
                  </div>

                  <div>
                    <label>Email Address</label>
                    <p>{student?.email || "Not available"}</p>
                  </div>

                  <div>
                    <label>Course</label>
                    <p>{student?.course || "Not assigned"}</p>
                  </div>
                </div>

                <button
                  className="view-profile-btn"
                  onClick={() => setActiveSection("My Profile")}
                >
                  View Full Profile →
                </button>
              </div>

              <div className="portal-panel">
                <div className="panel-heading">
                  <h3>Recent Activity</h3>
                </div>

                <div className="empty-state">
                  <div>📋</div>

                  <h4>No recent activity</h4>

                  <p>Your academic activities will appear here.</p>
                </div>
              </div>
            </section>

            {/* NOTIFICATIONS */}

            <section className="portal-panel notification-panel">
              <div className="panel-heading">
                <h3>Notifications & Announcements</h3>
                <span>UPDATES</span>
              </div>

              <div className="empty-notification">
                🔔 You currently have no new notifications.
              </div>
            </section>
          </>
        ) : activeSection === "Change Password" ? (
          <ChangePassword />
        ) : activeSection === "My Profile" ? (
          <MyProfile />
        ) : (
          <section className="portal-panel coming-soon">
            <div>🚧</div>

            <h2>{activeSection}</h2>

            <p>
              This section is being prepared. It will become available as we
              develop the EduSmart academic management system.
            </p>

            <button
              className="view-profile-btn"
              onClick={() => setActiveSection("Overview")}
            >
              Return to Overview
            </button>
          </section>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
