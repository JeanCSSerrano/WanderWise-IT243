<?php
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
        // 1. Delete associated comments first (Foreign Key constraint)
        $stmt_comments = $conn->prepare("DELETE FROM comments WHERE location_id = :id");
        $stmt_comments->execute([':id' => $id]);

        // 2. Delete the location
        $stmt_loc = $conn->prepare("DELETE FROM locations WHERE id = :id");
        $stmt_loc->execute([':id' => $id]);

        $_SESSION['success'] = "Location deleted successfully.";
    } catch(PDOException $e) {
        $_SESSION['error'] = "Error deleting location: " . $e->getMessage();
    }
}

// Send them back to the Manage page
header("Location: add_location.php");
exit();
?>