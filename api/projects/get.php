<?php

require_once __DIR__ . '/../lib/db.php';
require_once __DIR__ . '/../lib/json.php';
require_once __DIR__ . '/../lib/session.php';
require_once __DIR__ . '/../lib/time.php';

$slug = trim($_GET['slug'] ?? '');
if ($slug === '') {
    json_response(['ok' => false, 'error' => 'Missing slug'], 400);
}

$user = get_session_user();
$role = $user['role'] ?? null;

$pdo = db();

if ($user && $role === 'admin') {
    $stmt = $pdo->prepare(
        'SELECT p.*, IF(pl.user_id IS NULL, 0, 1) AS viewer_liked
         FROM projects p
         LEFT JOIN project_likes pl ON pl.project_id = p.id AND pl.user_id = ?
         WHERE p.slug = ?
         LIMIT 1'
    );
    $stmt->execute([(int)$user['id'], $slug]);
} elseif ($user) {
    $stmt = $pdo->prepare(
        'SELECT p.*, IF(pl.user_id IS NULL, 0, 1) AS viewer_liked
         FROM projects p
         LEFT JOIN project_likes pl ON pl.project_id = p.id AND pl.user_id = ?
         WHERE p.slug = ? AND (p.status = "approved" OR p.created_by_user_id = ?)
         LIMIT 1'
    );
    $stmt->execute([(int)$user['id'], $slug, (int)$user['id']]);
} else {
    $stmt = $pdo->prepare(
        'SELECT p.*, 0 AS viewer_liked
         FROM projects p
         WHERE p.slug = ? AND p.status = "approved"
         LIMIT 1'
    );
    $stmt->execute([$slug]);
}

$project = $stmt->fetch();
if (!$project) {
    json_response(['ok' => false, 'error' => 'Not found'], 404);
}

$links = json_decode($project['links_json'], true) ?: [];
$tech = json_decode($project['tech_stack_json'], true) ?: [];
$members = json_decode($project['team_members_json'], true) ?: [];
$screens = json_decode($project['screenshots_json'] ?? '[]', true) ?: [];

$editsOpen = edits_open();
$deadlineLabel = deadline_label();

$payload = [
    'id' => (int) $project['id'],
    'slug' => $project['slug'],
    'project_name' => $project['project_name'],
    'logo_url' => $project['logo_url'],
    'description' => $project['description'],
    'use_case' => $project['use_case'],
    'challenges' => $project['challenges'],
    'tech_stack' => $tech,
    'compatibility' => $project['compatibility'],
    'team_name' => $project['team_name'],
    'team_members' => $members,
    'links' => $links,
    'screenshots' => $screens,
    'track' => $project['track'],
    'likes_count' => (int) $project['likes_count'],
    'viewer_liked' => (int) ($project['viewer_liked'] ?? 0),
    'status' => $project['status'],
    'created_by_user_id' => (int) $project['created_by_user_id'],
    'edits_open' => $editsOpen,
    'deadline_label' => $deadlineLabel
];

json_response(['project' => $payload]);
