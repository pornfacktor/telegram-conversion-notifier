<?php
// handler.php

// Токен бота и chat_id (лучше вынести в .env или config и не пушить в GitHub)
$botToken = '7612537837:AAELqd5dWA6j6WaKaqjzYUaxE8Zz9ZbKsFo';
$chatId = '793835561'; // твой Telegram ID или группы

// Получаем JSON из POST-запроса
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo 'Invalid JSON';
    exit;
}

// Формируем сообщение для Telegram из данных конверсии
$message = "🚀 Новая конверсия!\n";

if (isset($data['id'])) {
    $message .= "ID: " . $data['id'] . "\n";
}

if (isset($data['status'])) {
    $message .= "Статус: " . $data['status'] . "\n";
}

if (isset($data['country'])) {
    $message .= "Страна: " . $data['country'] . "\n";
}

if (isset($data['payouts'])) {
    $message .= "Выплата: " . $data['payouts'] . "\n";
}

if (isset($data['offer']['title'])) {
    $message .= "Оффер: " . $data['offer']['title'] . "\n";
}

if (isset($data['sub1'])) {
    $message .= "Sub1: " . $data['sub1'] . "\n";
}

if (isset($data['clickid'])) {
    $message .= "ClickID: " . $data['clickid'] . "\n";
}

// Отправляем сообщение в Telegram
$sendTextUrl = "https://api.telegram.org/bot$botToken/sendMessage";

$postData = [
    'chat_id' => $chatId,
    'text' => $message,
    'parse_mode' => 'HTML',
];

$options = [
    'http' => [
        'method'  => 'POST',
        'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
        'content' => http_build_query($postData),
    ],
];

$context  = stream_context_create($options);
$result = file_get_contents($sendTextUrl, false, $context);

if ($result === FALSE) {
    http_response_code(500);
    echo 'Failed to send message';
    exit;
}

echo 'OK';
?>
