<?php
session_start();
include 'db_connect.php'; 

$user = $_POST['username'];
$pass = $_POST['password'];

// FETCH UNG USER
$stmt = $conn->prepare("SELECT id, password_hash, role FROM users WHERE username = ?");
$stmt->execute([$user]);
$row = $stmt->fetch();

// VERIFY
if ($row && password_verify($pass, $row['password_hash'])) {

    $_SESSION['user_id'] = $row['id'];
    $_SESSION['role'] = $row['role'];
    $_SESSION['username'] = $user;
    
    header("Location: index.php");
} else {
    echo "Invalid username or password.";
}
?>