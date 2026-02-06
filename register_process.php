<?php
include 'db_connect.php';
include 'logger.php'; // <--- Import the logger

$user = $_POST['username'];
$pass = $_POST['password'];

$hashed_pass = password_hash($pass, PASSWORD_DEFAULT);

try {
    $stmt = $conn->prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)");
    $stmt->execute([$user, $hashed_pass]);
    
    // --- LOGGING ---
    logActivity("New Account Created: '$user'", $user);
    // ----------------

    header("Location: login.php?success=Account created!");
} catch (PDOException $e) {
    // --- LOGGING ERROR ---
    logActivity("Registration Failed for '$user': Username taken", "Guest");
    // ---------------------
    
    echo "Error: Username might already be taken.";
}
?>