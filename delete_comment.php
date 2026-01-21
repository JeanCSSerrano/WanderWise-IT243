<?php
ob_start(); // 1. Start buffering to prevent "Headers already sent" errors
session_start();
include 'db_connect.php';

// Security Check
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    header("Location: login.php");
    exit();
}

if (isset($_GET['id'])) {
    $id = $_GET['id'];
    try {
        $stmt = $conn->prepare("DELETE FROM comments WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $_SESSION['success'] = "Comment deleted successfully.";
    } catch(PDOException $e) {
        $_SESSION['error'] = "Error deleting comment: " . $e->getMessage();
    }
}

// 2. Clear buffer and redirect
ob_end_clean(); 
header("Location: manage_comments.php");
exit();
?>