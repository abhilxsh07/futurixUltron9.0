<?php
header('Content-Type: application/json');
echo json_encode([
  'MYSQL_HOST' => getenv('MYSQL_HOST'),
  'MYSQL_PORT' => getenv('MYSQL_PORT'),
  'MYSQL_DATABASE' => getenv('MYSQL_DATABASE'),
  'MYSQL_USER' => getenv('MYSQL_USER'),
  'MYSQL_PASSWORD_present' => getenv('MYSQL_PASSWORD') !== false && getenv('MYSQL_PASSWORD') !== '',
  'MYSQL_PASSWORD_len' => getenv('MYSQL_PASSWORD') ? strlen(getenv('MYSQL_PASSWORD')) : 0
], JSON_PRETTY_PRINT);
