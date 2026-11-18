import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import readline from "readline";

import connectDB from "../config/db.js";
import Student from "../models/student.js";

dotenv.config();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (question) => {
    return new Promise((resolve) => {
        rl.question(question, resolve);
    });
};

const createAdmin = async () => {

    try {

        await connectDB();

        console.log("\nEDUSMART ADMIN SETUP\n");

        const firstName = await askQuestion("First Name: ");
        const lastName = await askQuestion("Last Name: ");
        const email = await askQuestion("Email Address: ");
        const phone = await askQuestion("Phone Number: ");
        const password = await askQuestion("Password: ");

        const existingAdmin = await Student.findOne({
            email: email.toLowerCase().trim()
        });

        if (existingAdmin) {

            console.log("\nAn account with this email already exists.");

            return;

        }

        const hashedPassword = await bcrypt.hash(password, 12);

        await Student.create({

            firstName,
            lastName,
            email,
            phone,
            gender: "Prefer not to say",
            course: "Administration",
            password: hashedPassword,
            role: "admin"

        });

        console.log("\nAdministrator created successfully!");

    } catch (error) {

        console.error("\nAdmin setup failed:", error.message);

    } finally {

        rl.close();

        await mongoose.disconnect();

    }

};

createAdmin();
