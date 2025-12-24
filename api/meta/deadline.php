<?php

require_once __DIR__ . '/../lib/json.php';
require_once __DIR__ . '/../lib/time.php';
require_once __DIR__ . '/../lib/session.php';

$user = get_session_user();
$isAdmin = $user && (($user['role'] ?? '') === 'admin');

json_response([
    'ok' => true,
    'deadline_label' => deadline_label(),
    'edits_open' => edits_open(),
    'can_submit' => $isAdmin ? true : edits_open()
]);
