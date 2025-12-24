<?php
$hash = '$2y$12$jRD5yY0JimAhNCzmP9an1uts3IjpvEZiI78WCiGTn872oCz.BEH9.';
var_dump(password_verify('AdminPass123!', $hash));
var_dump(password_verify('root', $hash));
