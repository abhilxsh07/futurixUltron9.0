<?php

require_once __DIR__ . '/../../lib/db.php';
require_once __DIR__ . '/../../lib/json.php';
require_once __DIR__ . '/../../lib/authz.php';

$user = require_auth();
require_admin($user);

$data = read_json();
$userId = (int) ($data['userId'] ?? 0);
$password = $data['password'] ?? '';
if ($userId <= 0 || $password === '') {
    json_response(['ok' => false, 'error' => 'Invalid input'], 400);
}

$hash = password_hash($password, PASSWORD_DEFAULT);
$pdo = db();
$stmt = $pdo->prepare('UPDATE users SET password_hash = ? WHERE id = ?');
$stmt->execute([$hash, $userId]);
json_response(['ok' => true]);
