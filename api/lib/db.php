<?php
require_once __DIR__ . '/env.php';
load_env(__DIR__ . '/../../.env');


function db(): PDO {
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }
    $host = env_value('MYSQL_HOST', '127.0.0.1');
    $port = env_value('MYSQL_PORT', '3306');
    $dbName = env_value('MYSQL_DATABASE', 'ultron');
    $user = env_value('MYSQL_USER', 'root');
    $pass = env_value('MYSQL_PASSWORD', '');
    $dsn = "mysql:host={$host};port={$port};dbname={$dbName};charset=utf8mb4";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
    return $pdo;
}
