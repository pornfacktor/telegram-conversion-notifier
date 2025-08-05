const express = require("express");
const fetch = require("node-fetch");
const app = express();

const botToken = "8377002181:AAE0WW3ne8F4-WjA_EOwLVWTucjBZNHjUX4";
const chatId = "793835561";

// Получение IP запроса
const getIP = (req) => {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket?.remoteAddress ||
    ""
  ).replace("::ffff:", "");
};

// Расшифровка статуса
const getStatusText = (status) => {
  switch (status) {
    case "1":
      return "✅ Принято";
    case "2":
      return "🕓 В обработке";
    case "3":
      return "❌ Отклонено";
    case "5":
      return "⏸ Холд";
    default:
      return "❓ Неизвестно";
  }
};

app.get("/", async (req, res) => {
  const ip = getIP(req);
  const {
    sum = "0",
    sub1 = "unknown",
    offer = "N/A",
    geo = "unknown",
    ip: userIp = "N/A",
    ref_id = "N/A",
    device_type = "unknown",
    status = "0"
  } = req.query;

  if (status !== "5") {
    console.log(`🔕 Пропущено: статус = ${status} (не холд)`);
    return res.send("Ignored (not hold)");
  }

  const statusText = getStatusText(status);

  const message = `🔥 Новая конверсия! В холде!
💡 Оффер: ${offer}
📌 Sub1: ${sub1}
💰 Выплата: ${sum}
📥 Статус: ${statusText}
📱 Устройство: ${device_type}
🌍 Страна: ${geo}
🌐 IP пользователя: ${userIp}
🔗 Click ID: ${ref_id}`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message }),
    });

    const data = await response.json();
    console.log("✅ Telegram отправлено:", data);
    res.send("OK");
  } catch (err) {
    console.error("❌ Ошибка при отправке в Telegram:", err);
    res.status(500).send("Ошибка");
  }
});

app.listen(3000, () => console.log("✅ Сервер запущен на порту 3000"));
