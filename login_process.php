<?php
session_start();
include 'db_connect.php'; // Your existing database connection file

$user = $_POST['username'];
$pass = $_POST['password'];

// 1. Fetch user from DB
$stmt = $conn->prepare("SELECT id, password_hash, role FROM users WHERE username = ?");
$stmt->execute([$user]);
$row = $stmt->fetch();

// 2. Verify
if ($row && password_verify($pass, $row['password_hash'])) {
    // 3. Store info in the "Wristband" (Session)
    $_SESSION['user_id'] = $row['id'];
    $_SESSION['role'] = $row['role'];
    $_SESSION['username'] = $user;
    
    header("Location: index.php"); // Send them back to the map
} else {
    echo "Invalid username or password.";
}
?>