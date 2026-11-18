import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

function AdminRoute() {

    const { student, loading } = useContext(AuthContext);

    // Wait for authentication to finish
    if (loading) {
        return <p>Loading...</p>;
    }

    // Redirect users who are not logged in
    if (!student) {
        return <Navigate to="/login" replace />;
    }

    // Prevent students from accessing admin pages
    if (student.role !== "admin") {
        return <Navigate to="/dashboard" replace />;
    }

    // Allow administrators
    return <Outlet />;

}

export default AdminRoute;
