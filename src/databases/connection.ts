import mongoose from "mongoose";

export const connectDB = async () => {
  try {
 
    const uri =
      process.env.MONGO_URI || "";

    mongoose.set("debug", true);
    const conn = await mongoose.connect(uri);

    console.log("MongoDB connected:", conn.connection.host);
    return conn;
  } catch (error) {
    console.error(" MongoDB connection error:", error);
    throw error; 
  }
};
