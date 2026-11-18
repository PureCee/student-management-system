import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Signup from "./pages/Signup";

import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";

import Navbar from "./components/Navbar";

import ProtectedRoute from "./components/ProtectedRoute";

import AdminRoute from "./components/AdminRoute";

import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />

        <Routes>
          <Route path="/" element={<Navigate to="/register" replace />} />

          {/* REGISTRATION */}

          <Route path="/register" element={<Signup />} />

          {/* LOGIN */}

          <Route path="/login" element={<Login />} />

          {/* STUDENT DASHBOARD */}

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* ADMIN DASHBOARD */}

          <Route element={<AdminRoute />}>
            <Route path="/admin-dashboard" 
            element={<AdminDashboard />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
