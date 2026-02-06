<?php
session_start();
include 'db_connect.php';
include 'logger.php';
date_default_timezone_set('Asia/Manila');

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    header("Location: login.php");
    exit();
}

$host = "localhost";
$user = "root";
$pass = ""; 
$dbname = "wanderwise_db";

$date = date('Y-m-d_H-i-s');
$backupFile = "backup_{$dbname}_{$date}.sql";


$command = "C:\\xampp\\mysql\\bin\\mysqldump --user={$user} --password={$pass} --host={$host} {$dbname} > {$backupFile}";

system($command, $output);


if (file_exists($backupFile)) {
   
    logActivity("Database Backup", "Admin created a backup: $backupFile");

  
    header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="' . basename($backupFile) . '"');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . filesize($backupFile));
    readfile($backupFile);

    unlink($backupFile);
    exit;
} else {
    logActivity("Error", "Backup failed. Command: $command");
    $_SESSION['error'] = "Backup failed. Check server logs.";
    header("Location: admin_dashboard.php");
}
?>