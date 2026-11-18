import Student from "../models/student.js";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";


// LOGIN CONTROLLER (STUDENT AND ADMIN)

export const loginStudent = async (req, res, next) => {

    try {

        // Get login information
        const { email, password } = req.body;


        // Find user using email
        const student = await Student.findOne({ email })
            .select("+password");


        // Check if user exists
        if (!student) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });

        }


        // Compare entered password with stored hash
        const isMatch = await bcrypt.compare(
            password,
            student.password
        );


        // Check password
        if (!isMatch) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });

        }


        // Generate JWT token
        const token = jwt.sign(

            {
                id: student._id,
                role: student.role
            },

            process.env.JWT_SECRET,

            {
                expiresIn: process.env.JWT_EXPIRES_IN || "1d"
            }

        );


        // Send successful response
        res.status(200).json({

            success: true,

            message: "Login successful!",

            token,

            student: {

                id: student._id,

                firstName: student.firstName,

                lastName: student.lastName,

                email: student.email,

                course: student.course,

                role: student.role

            }

        });


    } catch (error) {

        next(error);

    }

};


// GET USER PROFILE

export const getStudentProfile = async (req, res) => {

    res.status(200).json({

        success: true,

        student: {

            id: req.student._id,

            firstName: req.student.firstName,

            lastName: req.student.lastName,

            email: req.student.email,

            phone: req.student.phone,

            gender: req.student.gender,

            course: req.student.course,

            role: req.student.role

        }

    });

};



// CHANGE STUDENT PASSWORD

export const changeStudentPassword = async (req, res, next) => {

    try {

        // Get passwords from request body
        const { currentPassword, newPassword, confirmPassword } = req.body;


        // Check that all fields are provided
        if (!currentPassword || !newPassword || !confirmPassword) {

            return res.status(400).json({

                success: false,
                message: "Please provide all password fields."

            });

        }


        // Check new password length
        if (newPassword.length < 8) {

            return res.status(400).json({

                success: false,
                message: "New password must be at least 8 characters."

            });

        }


        // Check password confirmation
        if (newPassword !== confirmPassword) {

            return res.status(400).json({

                success: false,
                message: "New passwords do not match."

            });

        }


        // Retrieve authenticated user and password
        const student = await Student.findById(req.student._id)
            .select("+password");


        // Check whether account exists
        if (!student) {

            return res.status(404).json({

                success: false,
                message: "User account not found."

            });

        }


        // Verify current password
        const isMatch = await bcrypt.compare(

            currentPassword,

            student.password

        );


        if (!isMatch) {

            return res.status(401).json({

                success: false,
                message: "Current password is incorrect."

            });

        }


        // Prevent reuse of current password
        const samePassword = await bcrypt.compare(

            newPassword,

            student.password

        );


        if (samePassword) {

            return res.status(400).json({

                success: false,
                message: "New password must be different from current password."

            });

        }


        // Hash new password
        const salt = await bcrypt.genSalt(10);

        student.password = await bcrypt.hash(newPassword, salt);

        // Record when password was changed
        student.passwordChangedAt = new Date();


        // Save updated password
        await student.save();


        // Send success response
        res.status(200).json({

            success: true,

            message: "Password changed successfully."

        });


    } catch (error) {

        next(error);

    }

};
