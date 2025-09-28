import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
},
{ timestamps: true }
);

const Url = mongoose.model("Url", urlSchema);

export default Url;
