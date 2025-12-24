<?php

require_once __DIR__ . '/../../lib/db.php';
require_once __DIR__ . '/../../lib/json.php';
require_once __DIR__ . '/../../lib/authz.php';

$user = require_auth();
require_admin($user);

$data = read_json();
$email = strtolower(trim((string)($data['email'] ?? '')));
$password = (string)($data['password'] ?? '');
$role = (string)($data['role'] ?? 'participant');

if ($email === '' || $password === '' || !in_array($role, ['participant', 'admin'], true)) {
    json_response(['ok' => false, 'error' => 'Invalid input'], 400);
}

$pdo = db();

$check = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
$check->execute([$email]);
if ($check->fetch()) {
    json_response(['ok' => false, 'error' => 'User exists'], 409);
}

$hash = password_hash($password, PASSWORD_DEFAULT);
$stmt = $pdo->prepare('INSERT INTO users (email, password_hash, role, created_at) VALUES (?, ?, ?, NOW())');
$stmt->execute([$email, $hash, $role]);

json_response([
    'ok' => true,
    'user' => [
        'id' => (int)$pdo->lastInsertId(),
        'email' => $email,
        'role' => $role
    ]
]);
