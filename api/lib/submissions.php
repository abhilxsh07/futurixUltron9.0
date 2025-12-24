<?php

require_once __DIR__ . '/db.php';

function submission_deadline_value(): ?string {
    $pdo = db();
    $stmt = $pdo->prepare('SELECT v FROM settings WHERE k = ? LIMIT 1');
    $stmt->execute(['submission_deadline']);
    $row = $stmt->fetch();
    $v = $row['v'] ?? null;
    if ($v === null || $v === '') return null;
    return (string)$v;
}

function submission_is_open(): bool {
    $deadline = submission_deadline_value();
    if ($deadline === null) return true;
    $pdo = db();
    $stmt = $pdo->prepare('SELECT NOW() < ? AS open');
    $stmt->execute([$deadline]);
    $row = $stmt->fetch();
    return (int)($row['open'] ?? 0) === 1;
}

