<?php
session_start();
include 'db_connect.php';
include 'logger.php'; // Import Logger

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    header("Location: login.php");
    exit();
}

if (isset($_GET['id'])) {
    $id = $_GET['id'];

    try {
        // 1. FETCH NAME BEFORE DELETING (So the log knows what was deleted)
        $stmt_name = $conn->prepare("SELECT name FROM locations WHERE id = :id");
        $stmt_name->execute([':id' => $id]);
        $locName = $stmt_name->fetchColumn(); 

        // 2. DELETE COMMENTS FIRST (Foreign Key constraint)
        $stmt_comments = $conn->prepare("DELETE FROM comments WHERE location_id = :id");
        $stmt_comments->execute([':id' => $id]);

        // 3. DELETE LOCATION
        $stmt_loc = $conn->prepare("DELETE FROM locations WHERE id = :id");
        $stmt_loc->execute([':id' => $id]);

        // 4. LOG IT
        // Action: "Delete Location"
        // Details: Shows exactly which place was removed
        if ($locName) {
            logActivity("Delete Location", "Admin removed location: '$locName'", $id);
        } else {
            logActivity("Delete Location", "Admin removed unknown location ID: $id", $id);
        }

        $_SESSION['success'] = "Location deleted successfully.";
    } catch(PDOException $e) {
        $_SESSION['error'] = "Error deleting location: " . $e->getMessage();
        // Log the error
        logActivity("Error", "Failed to delete location ID $id: " . $e->getMessage());
    }
}

header("Location: add_location.php");
exit();
?>