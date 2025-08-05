const express = require("express");
const fetch = require("node-fetch");
const app = express();

// Telegram Bot Config
const botToken = "8377002181:AAE0WW3ne8F4-WjA_EOwLVWTucjBZNHjUX4";
const chatId = "793835561";

// Разрешенные IP Traforce
const allowedIPs = [
  "34.91.251.31", "34.147.118.21", "35.204.48.67", "35.204.104.2", "35.204.43.146",
  "35.204.87.67", "34.91.112.238", "34.147.113.15", "35.204.180.190", "34.141.152.46",
  "34.141.224.14", "35.204.161.57", "34.91.78.19", "34.90.35.51", "34.90.184.55",
  "34.90.152.245", "34.91.241.191", "34.90.205.231", "34.91.46.145", "34.91.168.254",
  "34.90.34.132", "34.91.12.113", "35.204.55.142", "34.141.199.40", "34.90.38.33",
  "34.91.140.189", "34.141.215.110", "35.204.48.174", "34.91.1.163", "34.147.93.32",
  "34.147.28.58", "34.141.168.175", "35.204.186.228", "34.91.116.30", "34.91.197.228",
  "34.90.41.177", "34.147.8.171"
];

// Получить IP адрес запроса
const getIP = (req) => {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket?.remoteAddress ||
    ""
  ).replace("::ffff:", "");
};

app.get("/", async (req, res) => {
  const ip = getIP(req);

  if (!allowedIPs.includes(ip)) {
    console.warn(`⛔ Блокировка подозрительного IP: ${ip}`);
    return res.status(403).send("Forbidden");
  }

  const {
    sub1 = "unknown",
    sum = "0",
    offer = "N/A",
    status = "confirmed"
  } = req.query;

  const message = `🔥 Новая конверсия!\n💡 Оффер: ${offer}\n📌 Sub1: ${sub1}\n💰 Выплата: ${sum}\n📥 Статус: ${status}\n🌐 IP: ${ip}`;

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
