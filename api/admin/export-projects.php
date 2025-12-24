<?php

require_once __DIR__ . '/../lib/db.php';
require_once __DIR__ . '/../lib/authz.php';

$user = require_auth();
require_admin($user);

$pdo = db();
$stmt = $pdo->query('SELECT project_name, team_name, description, use_case, challenges, tech_stack_json, compatibility, links_json, track, status, created_at FROM projects ORDER BY created_at DESC');
$rows = $stmt->fetchAll();

header('Content-Type: text/csv');
header('Content-Disposition: attachment; filename="ultron-projects.csv"');

$output = fopen('php://output', 'w');
fputcsv($output, ['project_name', 'team_name', 'description', 'use_case', 'challenges', 'tech_stack', 'compatibility', 'links', 'track', 'status', 'created_at']);
foreach ($rows as $row) {
    fputcsv($output, [
        $row['project_name'],
        $row['team_name'],
        $row['description'],
        $row['use_case'],
        $row['challenges'],
        $row['tech_stack_json'],
        $row['compatibility'],
        $row['links_json'],
        $row['track'],
        $row['status'],
        $row['created_at']
    ]);
}
