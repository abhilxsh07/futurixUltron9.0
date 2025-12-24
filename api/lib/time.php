<?php

require_once __DIR__ . '/env.php';

function submission_deadline(): ?DateTime {
    $raw = env_value('SUBMISSION_DEADLINE_ISO');
    if (!$raw) {
        return null;
    }
    try {
        $dt = new DateTime($raw);
        return $dt;
    } catch (Exception $e) {
        return null;
    }
}

function deadline_label(): string {
    $deadline = submission_deadline();
    if (!$deadline) {
        return 'Deadline: TBD';
    }
    return 'Deadline: ' . $deadline->format('M j, Y H:i');
}

function edits_open(): bool {
    $deadline = submission_deadline();
    if (!$deadline) {
        return true;
    }
    $now = new DateTime('now');
    return $now < $deadline;
}
