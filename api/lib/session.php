<?php

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/json.php';

function is_https(): bool {
    if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
        return true;
    }
    if (!empty($_SERVER['SERVER_PORT']) && (int)$_SERVER['SERVER_PORT'] === 443) {
        return true;
    }
    return false;
}

function create_session(int $userId): string {
    $token = bin2hex(random_bytes(32));
    $hash = hash('sha256', $token);
    $expires = new DateTime('+7 days');
    $pdo = db();
    $stmt = $pdo->prepare('INSERT INTO sessions (user_id, token_hash, created_at, expires_at) VALUES (?, ?, NOW(), ?)');
    $stmt->execute([$userId, $hash, $expires->format('Y-m-d H:i:s')]);
    return $token;
}

function set_session_cookie(string $token): void {
    setcookie('ultron_session', $token, [
        'expires' => time() + 60 * 60 * 24 * 7,
        'path' => '/',
        'secure' => is_https(),
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
}

function clear_session_cookie(): void {
    setcookie('ultron_session', '', [
        'expires' => time() - 3600,
        'path' => '/',
        'secure' => is_https(),
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
}

function session_login(int $userId): void {
    $token = create_session($userId);
    set_session_cookie($token);
}

function session_logout(): void {
    if (isset($_COOKIE['ultron_session'])) {
        revoke_session_by_token($_COOKIE['ultron_session']);
    }
    clear_session_cookie();
}

function get_session_user(): ?array {
    if (!isset($_COOKIE['ultron_session'])) {
        return null;
    }
    $token = $_COOKIE['ultron_session'];
    $hash = hash('sha256', $token);
    $pdo = db();
    $stmt = $pdo->prepare('SELECT sessions.id as session_id, users.id, users.email, users.role FROM sessions JOIN users ON sessions.user_id = users.id WHERE sessions.token_hash = ? AND sessions.revoked_at IS NULL AND sessions.expires_at > NOW()');
    $stmt->execute([$hash]);
    $user = $stmt->fetch();
    return $user ?: null;
}

function revoke_session_by_token(string $token): void {
    $hash = hash('sha256', $token);
    $pdo = db();
    $stmt = $pdo->prepare('UPDATE sessions SET revoked_at = NOW() WHERE token_hash = ?');
    $stmt->execute([$hash]);
}
