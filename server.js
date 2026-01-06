import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import menuRoutes from "./routes/menu.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// TEST endpoint
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Raviosta backend ishlayapti 🚀"
  });
});

app.use("/api/menu", menuRoutes);

// Telegram webhook (keyin to‘ldiramiz)
app.post("/telegram/webhook", (req, res) => {
  console.log("Telegram update:", req.body);
  res.sendStatus(200);
});

// Mini App test
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    time: new Date()
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server ishga tushdi: http://localhost:${PORT}`);
});

app.post("/telegram/webhook", (req, res) => {
  console.log("BUYURTMA KELDI:", req.body);
  res.sendStatus(200);
});

const message = update.message;
// oddiy /start javobi
if (message?.text === "/start") {
  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: message.chat.id,
      text: "🍕 Raviosta bot ishlayapti!\nBuyurtma berish uchun Mini App’ni oching 👇",
      reply_markup: {
        keyboard: [
          [
            {
              text: "📲 Buyurtma berish",
              web_app: { url: "https://YOUR_MINIAPP_URL" }
            }
          ]
        ],
        resize_keyboard: true
      }
    })
  });
}
