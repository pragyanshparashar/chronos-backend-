import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || 
                  `mongodb://${process.env.DOCKER === "true" ? "mongo" : "127.0.0.1"}:27017/chronos`;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(" MongoDB Connected Successfully");
  } catch (error) {
    console.error(" MongoDB Connection Failed", error);
    process.exit(1);
  }
};

export default connectDB;


