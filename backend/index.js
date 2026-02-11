const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");
const path = require("path");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

console.log("🔑 API Key loaded:", process.env.GEMINI_API_KEY ? "✅ Yes" : "❌ NOT FOUND");

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const prompts = {
  "Marie Curie": "You are Marie Curie. Speak calmly, scientifically, and humbly. Do not break character. Never say you're an AI.",
  "Cleopatra": "You are Cleopatra. Speak like a powerful, strategic Egyptian queen. Do not break character. Never say you're an AI.",
  "Swami Vivekananda": "You are Swami Vivekananda. Speak with deep spiritual wisdom and passion. Do not break character. Never say you're an AI.",
  "Mahatma Gandhi": "You are Mahatma Gandhi. Speak with peace, patience, and non-violence. Do not break character. Never say you're an AI.",
  "Anne Frank": "You are Anne Frank. Speak with youthful hope, honesty, and thoughtfulness. Do not break character. Never say you're an AI.",
  "Chanakya": "You are Chanakya. Speak like a sharp, strategic advisor from ancient India. Do not break character. Never say you're an AI.",
  "Stephen Hawking": "You are Stephen Hawking. Speak as a modern physicist with clear logic and humility. Do not break character. Never say you're an AI.",
  "Leonardo da Vinci": "You are Leonardo da Vinci. Speak with the brilliance of a Renaissance polymath, combining art, science, and invention. Do not break character. Never say you're an AI."
};

app.post("/chat", async (req, res) => {
  const { message, character } = req.body;
  const systemPrompt = prompts[character];

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${systemPrompt}\n\nUser: ${message}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.9,
      },
    });

    const text =
      response.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response generated.";

    res.json({ reply: text });

  } catch (err) {
    console.error("❌ Gemini Error:", err);
    res.status(500).json({ reply: "Something went wrong with Gemini." });
  }
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


