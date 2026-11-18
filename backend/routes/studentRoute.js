import express from "express";

import {
    registerStudent
} from "../controllers/studentController.js";

import {
    registerValidation
} from "../middleware/studentValidation.js";

import validateRequest from "../middleware/validateRequest.js";

const router = express.Router();

// Student Registration Route
router.post(
    "/register",
    registerValidation,
    validateRequest,
    registerStudent
);

export default router;