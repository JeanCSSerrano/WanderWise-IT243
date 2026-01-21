<?php
session_start();
include 'db_connect.php';


if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    header("Location: login.php");
    exit();
}

if (isset($_GET['id'])) {
    $id = $_GET['id'];

    try {
       
        $stmt_comments = $conn->prepare("DELETE FROM comments WHERE location_id = :id");
        $stmt_comments->execute([':id' => $id]);

       
        $stmt_loc = $conn->prepare("DELETE FROM locations WHERE id = :id");
        $stmt_loc->execute([':id' => $id]);

        $_SESSION['success'] = "Location deleted successfully.";
    } catch(PDOException $e) {
        $_SESSION['error'] = "Error deleting location: " . $e->getMessage();
    }
}


header("Location: add_location.php");
exit();
?>