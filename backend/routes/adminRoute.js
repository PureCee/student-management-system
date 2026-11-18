import express from "express";

import {
    getAdminDashboard,
    getAllStudents,
    updateStudent,
    deleteStudent
} from "../controllers/adminController.js";

import {
    protect,
    adminOnly
} from "../middleware/authMiddleware.js";


const router = express.Router();


// All routes below require administrator access
router.use(protect, adminOnly);


// Admin dashboard statistics
router.get(
    "/dashboard",
    getAdminDashboard
);


// View and search students
router.get(
    "/students",
    getAllStudents
);


// Update student
router.put(
    "/students/:id",
    updateStudent
);


// Delete student
router.delete(
    "/students/:id",
    deleteStudent
);


export default router;
