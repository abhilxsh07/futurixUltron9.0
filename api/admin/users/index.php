<?php

require_once __DIR__ . '/../../lib/db.php';
require_once __DIR__ . '/../../lib/json.php';
require_once __DIR__ . '/../../lib/authz.php';

$user = require_auth();
require_admin($user);

$pdo = db();
$stmt = $pdo->query('SELECT id, email, role, created_at FROM users ORDER BY created_at DESC');
$items = $stmt->fetchAll(PDO::FETCH_ASSOC);

json_response(['ok' => true, 'items' => $items]);
