import mongoose from "mongoose";

const connectDB = async () => {

  try {

    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(
      `MongoDB Connected Successfully: ${conn.connection.host}`
    );

    return conn;

  } catch (error) {

    console.error("Database Connection Error:", error.message);

    throw error;

  }

};

export default connectDB;