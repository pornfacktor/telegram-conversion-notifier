const express = require("express");
const fetch = require("node-fetch");
const app = express();

const botToken = "8377002181:AAE0WW3ne8F4-WjA_EOwLVWTucjBZNHjUX4";
const chatId = "793835561";

app.get("/", async (req, res) => {
  const { sub1 = "unknown", country = "unknown", payout = "0", status = "N/A" } = req.query;
  const message = `🔥 Новая конверсия!\n▶️ Sub1: ${sub1}\n🌍 Страна: ${country}\n💰 Выплата: ${payout}\n📌 Статус: ${status}`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message }),
    });

    const data = await response.json();
    console.log("Telegram response:", data);
    res.send("OK");
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Failed to send Telegram message");
  }
});

app.listen(3000, () => console.log("Bot is live on port 3000"));
