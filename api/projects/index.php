<?php

require_once __DIR__ . '/../lib/db.php';
require_once __DIR__ . '/../lib/json.php';
require_once __DIR__ . '/../lib/session.php';

$user = get_session_user();
$role = $user['role'] ?? null;

$search = trim($_GET['search'] ?? '');
$track = trim($_GET['track'] ?? '');
$tech = trim($_GET['tech'] ?? '');
$compatibility = trim($_GET['compatibility'] ?? '');
$mine = trim($_GET['mine'] ?? '');
$page = max(1, (int)($_GET['page'] ?? 1));
$pageSize = max(1, min(48, (int)($_GET['pageSize'] ?? 24)));
$offset = ($page - 1) * $pageSize;

$where = [];
$params = [];

if ($search !== '') {
    $where[] = 'projects.project_name LIKE ?';
    $params[] = '%' . $search . '%';
}
if ($track !== '') {
    $where[] = 'projects.track = ?';
    $params[] = $track;
}
if ($compatibility !== '') {
    $where[] = 'projects.compatibility = ?';
    $params[] = $compatibility;
}
if ($tech !== '') {
    $where[] = 'projects.tech_stack_json LIKE ?';
    $params[] = '%' . $tech . '%';
}

$statusClause = '';

if ($mine === '1') {
    if (!$user) {
        json_response(['ok' => false, 'error' => 'Unauthorized'], 401);
    }
    $where[] = 'projects.created_by_user_id = ?';
    $params[] = (int)$user['id'];
} else {
    if ($role === 'admin') {
        $statusClause = '';
    } elseif ($user) {
        $statusClause = '(projects.status = "approved" OR projects.created_by_user_id = ?)';
        $params[] = (int)$user['id'];
    } else {
        $statusClause = 'projects.status = "approved"';
    }
}

$clauses = $where;
if ($statusClause !== '') {
    $clauses[] = $statusClause;
}

$whereSql = $clauses ? ('WHERE ' . implode(' AND ', $clauses)) : '';

$pdo = db();

$countStmt = $pdo->prepare("SELECT COUNT(*) as total FROM projects {$whereSql}");
$countStmt->execute($params);
$total = (int)($countStmt->fetch()['total'] ?? 0);

$viewerJoin = '';
$viewerSelect = '0 AS viewer_liked';
$viewerParams = [];

if ($user) {
    $viewerJoin = 'LEFT JOIN project_likes pl ON pl.project_id = projects.id AND pl.user_id = ?';
    $viewerSelect = 'IF(pl.user_id IS NULL, 0, 1) AS viewer_liked';
    $viewerParams[] = (int)$user['id'];
}

$sql = "SELECT projects.id, projects.slug, projects.project_name, projects.logo_url, projects.description, projects.team_name, projects.track, projects.likes_count, projects.status, {$viewerSelect}
        FROM projects
        {$viewerJoin}
        {$whereSql}
        ORDER BY projects.created_at DESC
        LIMIT ? OFFSET ?";

$itemsStmt = $pdo->prepare($sql);

$bindParams = array_merge($viewerParams, $params);
$idx = 1;
foreach ($bindParams as $p) {
    $itemsStmt->bindValue($idx++, $p);
}
$itemsStmt->bindValue($idx++, $pageSize, PDO::PARAM_INT);
$itemsStmt->bindValue($idx++, $offset, PDO::PARAM_INT);

$itemsStmt->execute();
$items = $itemsStmt->fetchAll();

json_response([
    'items' => $items,
    'total' => $total,
    'page' => $page,
    'pageSize' => $pageSize
]);
