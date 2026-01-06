import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

import menuRoutes from "./routes/menu.js";
import { createIikoOrder } from "./services/iikoOrder.js";

/* =========================
   ENV
========================= */
dotenv.config();

/* =========================
   APP
========================= */
const app = express();
const PORT = process.env.PORT || 3000;

/* =========================
   TELEGRAM API (ENG MUHIM)
========================= */
if (!process.env.BOT_TOKEN) {
  console.error("❌ BOT_TOKEN env yo‘q!");
}
const TELEGRAM_API = `https://api.telegram.org/bot8061262878:AAFzdxy4WV-OojxSN02Pyw9BUJRULaksTRs`;

/* =========================
   MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());

/* =========================
   TEST ROUTE
========================= */
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Raviosta backend ishlayapti 🚀"
  });
});

/* =========================
   MENU ROUTE
========================= */
app.use("/api/menu", menuRoutes);

/* =========================
   TELEGRAM POLLING (NGROKSIZ)
========================= */
let lastUpdateId = 0;

setInterval(async () => {
  try {
    const response = await fetch(
      `${TELEGRAM_API}/getUpdates?offset=${lastUpdateId + 1}`
    );
    const data = await response.json();

    if (!data.result || data.result.length === 0) return;

    for (const update of data.result) {
      lastUpdateId = update.update_id;

      const message = update.message;
      if (!message) continue;

      /* ---------- /start ---------- */
      if (message.text === "/start") {
        await fetch(`${TELEGRAM_API}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: message.chat.id,
            text:
              "🍕 Raviosta bot ishga tushdi!\n\n" +
              "Buyurtma berish uchun pastdagi tugmani bosing 👇",
            reply_markup: {
              keyboard: [
                [
                  {
                    text: "📲 Buyurtma berish",
                    web_app: {
                      // 🔴 BU YERGA GITHUB PAGES MINI APP URL
                      url: "https://clymat-star.github.io/raviosta-miniapp/"
                    }
                  }
                ]
              ],
              resize_keyboard: true
            }
          })
        });
      }

      /* ---------- MINI APP BUYURTMA ---------- */
      if (message.web_app_data?.data) {
        const payload = JSON.parse(message.web_app_data.data);
        console.log("📦 BUYURTMA KELDI:", payload);

        try {
          const result = await createIikoOrder(payload.order);
          console.log("🍽 IIKO ORDER:", result);

          await fetch(`${TELEGRAM_API}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: message.chat.id,
              text: "✅ Buyurtma oshxonaga yuborildi"
            })
          });
        } catch (err) {
          console.error("❌ IIKO error:", err.message);

          await fetch(`${TELEGRAM_API}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: message.chat.id,
              text: "❌ Buyurtma yuborishda xatolik bo‘ldi"
            })
          });
        }
      }
    }
  } catch (err) {
    console.error("Telegram polling error:", err.message);
  }
}, 3000);

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(`✅ Server ishga tushdi: http://localhost:${PORT}`);
});
