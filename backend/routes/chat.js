// routes/chat.js
import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config(); // 🔑 Load .env here too

const router = express.Router();

// ✅ Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", async (req, res) => {
  try {
    const { message, model } = req.body;

    if (!message || typeof message !== "string") {
      return res
        .status(400)
        .json({ error: "Message is required and must be a string" });
    }

    // ✅ Streaming headers
    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");

    // Keep connection alive
    res.flushHeaders?.();

    // ✅ Start streaming from OpenAI
    const stream = await openai.chat.completions.create({
      model: model || "gpt-4o-mini",
      messages: [{ role: "user", content: message }],
      stream: true,
    });

    for await (const chunk of stream) {
      const token = chunk.choices?.[0]?.delta?.content || "";
      if (token) {
        // Wrap in SSE format
        res.write(`data: ${token}\n\n`);
      }
    }

    // ✅ End stream properly
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    console.error("❌ OpenAI stream error:", err.message);

    if (!res.headersSent) {
      res.status(500).json({ error: "Streaming failed" });
    } else {
      // Send error through SSE channel
      res.write(`data: [ERROR] ${err.message}\n\n`);
      res.end();
    }
  }
});

export default router;
