<?php

require_once __DIR__ . '/../lib/json.php';
require_once __DIR__ . '/../lib/session.php';

session_logout();
json_response(['ok' => true]);
