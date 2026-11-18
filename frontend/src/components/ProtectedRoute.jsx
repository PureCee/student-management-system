import { useContext } from "react";

import { Navigate, Outlet } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";


function ProtectedRoute() {

    const { student, loading } = useContext(AuthContext);


    // Wait until authentication is checked
    if (loading) {

        return <h2>Checking authentication...</h2>;

    }


    // Redirect unauthenticated users
    if (!student) {

        return <Navigate to="/login" replace />;

    }


    // Prevent administrators from accessing student dashboard
    if (student.role !== "student") {

        return <Navigate to="/admin-dashboard" replace />;

    }


    return <Outlet />;

}

export default ProtectedRoute;
