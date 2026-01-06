let lastUpdateId = 0;

setInterval(async () => {
  try {
    const res = await fetch(
      `${TELEGRAM_API}/getUpdates?offset=${lastUpdateId + 1}`
    );
    const data = await res.json();

    if (!data.result || data.result.length === 0) return;

    for (const update of data.result) {
      lastUpdateId = update.update_id;

      const message = update.message;
      if (!message) continue;

      // /start komandasi
      if (message.text === "/start") {
        await fetch(`${TELEGRAM_API}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: message.chat.id,
            text:
              "🍕 Raviosta bot ishga tushdi!\n" +
              "Buyurtma berish uchun tugmani bosing 👇",
            reply_markup: {
              keyboard: [
                [
                  {
                    text: "📲 Buyurtma berish",
                    web_app: {
                      url: "https://RAVIosta-miniapp.netlify.app"
                    }
                  }
                ]
              ],
              resize_keyboard: true
            }
          })
        });
      }

      // Mini App’dan buyurtma
      if (message.web_app_data?.data) {
        const payload = JSON.parse(message.web_app_data.data);

        console.log("📦 BUYURTMA KELDI:", payload);

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
      }
    }
  } catch (err) {
    console.error("Telegram polling error:", err.message);
  }
}, 3000);
