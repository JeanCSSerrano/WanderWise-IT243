<?php
session_start();
include 'db_connect.php';

// 1. Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "You must be logged in."]);
    exit();
}

// 2. Get data
$user_id = $_SESSION['user_id'];
$location_id = $_POST['location_id'];
$text = htmlspecialchars($_POST['comment_text']); // Clean up bad characters

// 3. Save to DB
try {
    $stmt = $conn->prepare("INSERT INTO comments (user_id, location_id, comment_text) VALUES (?, ?, ?)");
    $stmt->execute([$user_id, $location_id, $text]);
    echo json_encode(["status" => "success"]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Database error"]);
}
?>