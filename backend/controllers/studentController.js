import Student from "../models/student.js";
import bcrypt from "bcryptjs";

export const registerStudent = async (req, res, next) => {

    try {

        // Get student information from the request
        const {
            firstName,
            lastName,
            email,
            phone,
            gender,
            course,
            password,
        } = req.body;


        // Hash the student's password
        const hashedPassword = await bcrypt.hash(password, 12);


        // Create a new student record
        const student = await Student.create({

            firstName,
            lastName,
            email,
            phone,
            gender,
            course,

            password: hashedPassword,

            // Public registration can ONLY create students
            role: "student",

        });


        // Send successful response
        res.status(201).json({

            success: true,

            message: "Student registered successfully!",

            student: {

                id: student._id,
                firstName: student.firstName,
                lastName: student.lastName,
                email: student.email,
                course: student.course,
                role: student.role,

            },

        });

    } catch (error) {

        next(error);

    }

};
