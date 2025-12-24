<?php

require_once __DIR__ . '/../lib/db.php';
require_once __DIR__ . '/../lib/json.php';
require_once __DIR__ . '/../lib/authz.php';

$user = require_auth();
$data = read_json();
$slug = trim((string)($data['slug'] ?? ''));

if ($slug === '') {
    json_response(['ok' => false, 'error' => 'Missing slug'], 400);
}

$pdo = db();

if (($user['role'] ?? '') === 'admin') {
    $pstmt = $pdo->prepare('SELECT id, likes_count FROM projects WHERE slug = ? LIMIT 1');
    $pstmt->execute([$slug]);
} else {
    $pstmt = $pdo->prepare('SELECT id, likes_count FROM projects WHERE slug = ? AND (status = "approved" OR created_by_user_id = ?) LIMIT 1');
    $pstmt->execute([$slug, (int)$user['id']]);
}

$project = $pstmt->fetch(PDO::FETCH_ASSOC);
if (!$project) {
    json_response(['ok' => false, 'error' => 'Not found'], 404);
}

$projectId = (int)$project['id'];
$userId = (int)$user['id'];

$pdo->beginTransaction();
try {
    $ins = $pdo->prepare('INSERT IGNORE INTO project_likes (project_id, user_id, created_at) VALUES (?, ?, NOW())');
    $ins->execute([$projectId, $userId]);

    if ($ins->rowCount() > 0) {
        $upd = $pdo->prepare('UPDATE projects SET likes_count = likes_count + 1 WHERE id = ?');
        $upd->execute([$projectId]);
    }

    $get = $pdo->prepare('SELECT likes_count FROM projects WHERE id = ?');
    $get->execute([$projectId]);
    $likesCount = (int)($get->fetch(PDO::FETCH_ASSOC)['likes_count'] ?? 0);

    $pdo->commit();
} catch (Exception $e) {
    $pdo->rollBack();
    json_response(['ok' => false, 'error' => 'Like failed'], 500);
}

json_response([
    'ok' => true,
    'likes_count' => $likesCount,
    'viewer_liked' => true
]);
