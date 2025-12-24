<?php

require_once __DIR__ . '/../lib/db.php';
require_once __DIR__ . '/../lib/json.php';
require_once __DIR__ . '/../lib/authz.php';

$user = require_auth();
require_admin($user);

$data = read_json();
$slug = trim((string)($data['slug'] ?? ''));

if ($slug === '') {
    json_response(['ok' => false, 'error' => 'Missing slug'], 400);
}

$pdo = db();

$pdo->beginTransaction();
try {
    $stmt = $pdo->prepare('SELECT id FROM projects WHERE slug = ? LIMIT 1');
    $stmt->execute([$slug]);
    $project = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$project) {
        $pdo->rollBack();
        json_response(['ok' => false, 'error' => 'Not found'], 404);
    }

    $projectId = (int)$project['id'];

    $delLikes = $pdo->prepare('DELETE FROM project_likes WHERE project_id = ?');
    $delLikes->execute([$projectId]);

    $delProject = $pdo->prepare('DELETE FROM projects WHERE id = ?');
    $delProject->execute([$projectId]);

    $pdo->commit();
} catch (Exception $e) {
    $pdo->rollBack();
    json_response(['ok' => false, 'error' => 'Delete failed'], 500);
}

json_response(['ok' => true]);
