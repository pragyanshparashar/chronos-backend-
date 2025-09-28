import mongoose from "mongoose";

const testMongoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

const TestMongo = mongoose.model("TestMongo", testMongoSchema);

export default TestMongo;


