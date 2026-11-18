import express from "express";

import {
    loginStudent,
    getStudentProfile,
    changeStudentPassword
} from "../controllers/authController.js";

import {
    loginValidation
} from "../middleware/studentValidation.js";

import validateRequest from "../middleware/validateRequest.js";

import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();


// Student Login
router.post(
    "/login",
    loginValidation,
    validateRequest,
    loginStudent
);


// Protected Student Profile
router.get(
    "/profile",
    protect,
    getStudentProfile
);

router.put(
    "/change-password",
    protect,
    changeStudentPassword
);

export default router;