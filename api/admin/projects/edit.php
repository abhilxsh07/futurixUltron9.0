<?php

require_once __DIR__ . '/../../lib/db.php';
require_once __DIR__ . '/../../lib/json.php';
require_once __DIR__ . '/../../lib/authz.php';

$user = require_auth();
require_admin($user);

$data = read_json();
$slug = trim($data['slug'] ?? '');
if ($slug === '') {
    json_response(['ok' => false, 'error' => 'Missing slug'], 400);
}

$pdo = db();
$stmt = $pdo->prepare('SELECT * FROM projects WHERE slug = ?');
$stmt->execute([$slug]);
$project = $stmt->fetch();
if (!$project) {
    json_response(['ok' => false, 'error' => 'Not found'], 404);
}

function word_count(string $text): int {
    $words = preg_split('/\s+/', trim($text));
    return $words && $words[0] !== '' ? count($words) : 0;
}

function validate_url(string $url, bool $required = true): bool {
    if ($url === '') {
        return !$required;
    }
    if (!filter_var($url, FILTER_VALIDATE_URL)) {
        return false;
    }
    return preg_match('/^https?:\/\//', $url) === 1;
}

$requiredFields = ['project_name', 'logo_url', 'description', 'use_case', 'challenges', 'compatibility', 'team_name', 'github_url'];
foreach ($requiredFields as $field) {
    if (!isset($data[$field]) || trim((string) $data[$field]) === '') {
        json_response(['ok' => false, 'error' => 'Missing required fields'], 400);
    }
}

$tech = $data['tech_stack'] ?? [];
$members = $data['team_members'] ?? [];
if (!is_array($tech) || count($tech) < 1 || !is_array($members) || count($members) < 1) {
    json_response(['ok' => false, 'error' => 'Tech stack and team members required'], 400);
}

if (word_count((string) $data['description']) > 500) {
    json_response(['ok' => false, 'error' => 'Description too long'], 400);
}

$compatibility = $data['compatibility'];
$allowed = ['web', 'android', 'ios', 'desktop', 'other'];
if (!in_array($compatibility, $allowed, true)) {
    json_response(['ok' => false, 'error' => 'Invalid compatibility'], 400);
}

$logoUrl = trim($data['logo_url']);
$githubUrl = trim($data['github_url']);
$demoUrl = trim($data['demo_url'] ?? '');
$docsUrl = trim($data['docs_url'] ?? '');
$videoUrl = trim($data['video_url'] ?? '');
$screenshots = $data['screenshots_urls'] ?? [];

if (!validate_url($logoUrl) || !validate_url($githubUrl) || !validate_url($demoUrl, false) || !validate_url($docsUrl, false) || !validate_url($videoUrl, false)) {
    json_response(['ok' => false, 'error' => 'Invalid URL'], 400);
}

if (!is_array($screenshots)) {
    $screenshots = [];
}
foreach ($screenshots as $url) {
    if (!validate_url((string) $url, false)) {
        json_response(['ok' => false, 'error' => 'Invalid screenshot URL'], 400);
    }
}

$links = [
    'github_url' => $githubUrl
];
if ($demoUrl) {
    $links['demo_url'] = $demoUrl;
}
if ($docsUrl) {
    $links['docs_url'] = $docsUrl;
}
if ($videoUrl) {
    $links['video_url'] = $videoUrl;
}

$stmt = $pdo->prepare('UPDATE projects SET project_name = ?, logo_url = ?, description = ?, use_case = ?, challenges = ?, tech_stack_json = ?, compatibility = ?, team_name = ?, team_members_json = ?, links_json = ?, screenshots_json = ?, track = ?, updated_at = NOW() WHERE id = ?');
$stmt->execute([
    $data['project_name'],
    $logoUrl,
    $data['description'],
    $data['use_case'],
    $data['challenges'],
    json_encode(array_values($tech)),
    $compatibility,
    $data['team_name'],
    json_encode(array_values($members)),
    json_encode($links),
    json_encode(array_values($screenshots)),
    $data['track'] ?? null,
    (int) $project['id']
]);

json_response(['ok' => true]);
