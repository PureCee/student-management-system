import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import connectDB from "./config/db.js";

import studentRoute from "./routes/studentRoute.js";

import authRoutes from "./routes/authRoutes.js";

import adminRoutes from "./routes/adminRoute.js";

import {
  notFound,
  errorHandler,
} from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

// Middleware
app.use(helmet());

app.use(cors({
    origin: ["http://localhost:5173", 
    "https://student-management-system-eight-sepia.vercel.app",],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

app.use(express.json());

app.use(morgan("dev"));

// Test route
app.get("/", (req, res) => {
  res.send("Student Management System API is running!");
});

// Student routes
app.use("/api/students", studentRoute);

app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server after database connection
const startServer = async () => {

  try {

    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {

    console.error("Failed to start server:", error.message);

    process.exit(1);

  }

};

startServer();