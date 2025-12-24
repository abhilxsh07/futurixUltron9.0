<?php

require_once __DIR__ . '/../lib/json.php';
require_once __DIR__ . '/../lib/session.php';

$user = get_session_user();

if (!$user) {
    json_response(['authenticated' => false]);
}

json_response([
    'authenticated' => true,
    'user' => [
        'id' => (int)$user['id'],
        'email' => $user['email'],
        'role' => $user['role']
    ]
]);
