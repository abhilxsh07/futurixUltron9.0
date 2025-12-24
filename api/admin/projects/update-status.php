<?php

require_once __DIR__ . '/../../lib/db.php';
require_once __DIR__ . '/../../lib/json.php';
require_once __DIR__ . '/../../lib/authz.php';

$user = require_auth();
require_admin($user);

$data = read_json();
$projectId = (int) ($data['projectId'] ?? 0);
$status = $data['status'] ?? '';
$allowed = ['pending', 'approved', 'hidden'];
if ($projectId <= 0 || !in_array($status, $allowed, true)) {
    json_response(['ok' => false, 'error' => 'Invalid request'], 400);
}

$pdo = db();
$stmt = $pdo->prepare('UPDATE projects SET status = ?, updated_at = NOW() WHERE id = ?');
$stmt->execute([$status, $projectId]);
json_response(['ok' => true]);
