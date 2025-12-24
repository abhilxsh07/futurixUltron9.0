<?php

require_once __DIR__ . '/session.php';
require_once __DIR__ . '/json.php';

function require_auth(): array {
    $user = get_session_user();
    if (!$user) {
        json_response(['ok' => false, 'error' => 'Unauthorized'], 401);
    }
    return $user;
}

function require_admin(array $user): void {
    if (($user['role'] ?? '') !== 'admin') {
        json_response(['ok' => false, 'error' => 'Forbidden'], 403);
    }
}
