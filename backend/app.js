import express from "express";
// import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import chatRouter from "./routes/chat.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors()); // allow all origins (for dev; restrict in prod)
app.use(express.json());

app.use("/api/chat", chatRouter);

app.get("/", (req, res) => {
  res.send("✅ Backend is running");
});

// --- If you want Mongo later, uncomment this ---
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("✅ MongoDB connected");
//     app.listen(port, () => {
//       console.log(`🚀 Server running on http://localhost:${port}`);
//     });
//   })
//   .catch((err) => console.error("❌ Mongo error:", err));

// --- Fallback: run without Mongo ---
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
