<?php

require_once __DIR__ . '/../lib/db.php';
require_once __DIR__ . '/../lib/json.php';
require_once __DIR__ . '/../lib/session.php';

$raw = file_get_contents('php://input');
$body = json_decode($raw, true);

if (!is_array($body)) {
    json_response(['error' => 'Invalid JSON'], 400);
}

$email = trim((string)($body['email'] ?? ''));
$password = (string)($body['password'] ?? '');

if ($email === '' || $password === '') {
    json_response(['error' => 'Missing fields'], 400);
}

$pdo = db();
$stmt = $pdo->prepare('SELECT id, email, password_hash, role FROM users WHERE email = ? LIMIT 1');
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || !password_verify($password, $user['password_hash'])) {
    json_response(['error' => 'Invalid credentials'], 401);
}

session_login((int)$user['id']);


json_response([
    'ok' => true,
    'user' => [
        'id' => (int)$user['id'],
        'email' => $user['email'],
        'role' => $user['role']
    ]
]);
