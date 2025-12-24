<?php

require_once __DIR__ . '/../../lib/db.php';
require_once __DIR__ . '/../../lib/json.php';
require_once __DIR__ . '/../../lib/authz.php';

$user = require_auth();
require_admin($user);

$data = read_json();
$slug = trim((string)($data['slug'] ?? ''));

if ($slug === '') {
    json_response(['ok' => false, 'error' => 'Missing slug'], 400);
}

$pdo = db();
$stmt = $pdo->prepare('SELECT id FROM projects WHERE slug = ? LIMIT 1');
$stmt->execute([$slug]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$row) {
    json_response(['ok' => false, 'error' => 'Not found'], 404);
}

$projectId = (int)$row['id'];

$pdo->beginTransaction();
try {
    $pdo->prepare('DELETE FROM project_likes WHERE project_id = ?')->execute([$projectId]);
    $pdo->prepare('DELETE FROM projects WHERE id = ?')->execute([$projectId]);
    $pdo->commit();
} catch (Exception $e) {
    $pdo->rollBack();
    json_response(['ok' => false, 'error' => 'Delete failed'], 500);
}

json_response(['ok' => true]);
