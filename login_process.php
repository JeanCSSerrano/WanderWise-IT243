<?php
session_start();
include 'db_connect.php'; 
include 'logger.php'; 

// FIX: Clear any existing login session immediately.
// This ensures that if the login fails, it logs as "Guest" (NULL), 
// not as the user who was previously logged in.
if (isset($_SESSION['user_id'])) {
    unset($_SESSION['user_id']);
    unset($_SESSION['role']);
    unset($_SESSION['username']);
}

$user = $_POST['username'];
$pass = $_POST['password'];

// FETCH USER
$stmt = $conn->prepare("SELECT id, password_hash, role FROM users WHERE username = ?");
$stmt->execute([$user]);
$row = $stmt->fetch();

// VERIFY
if ($row && password_verify($pass, $row['password_hash'])) {

    // Login Success: Set the session variables
    $_SESSION['user_id'] = $row['id'];
    $_SESSION['role'] = $row['role'];
    $_SESSION['username'] = $user;
    
    // Log the success (Now it will use the NEW user_id)
    logActivity("User Logged In Successfully", $user);

    header("Location: index.php");
} else {
    // Login Failed: Session is empty, so user_id will be NULL (Guest)
    logActivity("Failed Login Attempt for username: '$user'", "Guest");
    
    // Redirect back with error (Optional improvement over plain echo)
    echo "Invalid username or password.";
}
?>