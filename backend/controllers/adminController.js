import Student from "../models/student.js";


// GET ADMIN DASHBOARD STATISTICS

export const getAdminDashboard = async (req, res, next) => {

    try {

        // Count registered students
        const totalStudents = await Student.countDocuments({
            role: "student"
        });

        // Count unique courses
        const courses = await Student.distinct("course", {
            role: "student"
        });

        // Get five most recently registered students
        const recentStudents = await Student.find({
            role: "student"
        })
        .select("firstName lastName email course createdAt")
        .sort({ createdAt: -1 })
        .limit(5);


        res.status(200).json({

            success: true,

            statistics: {
                totalStudents,
                totalCourses: courses.length
            },

            recentStudents

        });

    } catch (error) {

        next(error);

    }

};


// GET ALL STUDENTS

export const getAllStudents = async (req, res, next) => {

    try {

        const { search } = req.query;

        let query = {
            role: "student"
        };

        // Search by name, email or course
        if (search) {

            const searchRegex = new RegExp(
                search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
                "i"
            );

            query.$or = [
                { firstName: searchRegex },
                { lastName: searchRegex },
                { email: searchRegex },
                { course: searchRegex }
            ];

        }


        const students = await Student.find(query)
            .select("-password")
            .sort({ createdAt: -1 });


        res.status(200).json({

            success: true,

            count: students.length,

            students

        });

    } catch (error) {

        next(error);

    }

};


// UPDATE STUDENT INFORMATION

export const updateStudent = async (req, res, next) => {

    try {

        const {
            firstName,
            lastName,
            email,
            phone,
            gender,
            course
        } = req.body;


        // Only allow these fields to be updated
        const updates = {};

        if (firstName !== undefined) updates.firstName = firstName;
        if (lastName !== undefined) updates.lastName = lastName;
        if (email !== undefined) updates.email = email;
        if (phone !== undefined) updates.phone = phone;
        if (gender !== undefined) updates.gender = gender;
        if (course !== undefined) updates.course = course;


        const student = await Student.findOneAndUpdate(

            {
                _id: req.params.id,
                role: "student"
            },

            updates,

            {
                new: true,
                runValidators: true
            }

        ).select("-password");


        if (!student) {

            return res.status(404).json({

                success: false,

                message: "Student not found."

            });

        }


        res.status(200).json({

            success: true,

            message: "Student updated successfully!",

            student

        });

    } catch (error) {

        next(error);

    }

};


// DELETE STUDENT

export const deleteStudent = async (req, res, next) => {

    try {

        const student = await Student.findOneAndDelete({

            _id: req.params.id,

            role: "student"

        });


        if (!student) {

            return res.status(404).json({

                success: false,

                message: "Student not found."

            });

        }


        res.status(200).json({

            success: true,

            message: "Student deleted successfully!"

        });

    } catch (error) {

        next(error);

    }

};
