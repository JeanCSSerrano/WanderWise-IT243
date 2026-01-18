<?php
include 'db_connect.php'; // Using your PDO connection

$user = $_POST['username'];
$pass = $_POST['password'];

// 1. Hash the password for security
$hashed_pass = password_hash($pass, PASSWORD_DEFAULT);

try {
    // 2. Insert into database (Role defaults to 'user')
    $stmt = $conn->prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)");
    $stmt->execute([$user, $hashed_pass]);
    
    // 3. Success! Send them to login
    header("Location: login.php?success=Account created!");
} catch (PDOException $e) {
    // Usually triggers if the username already exists
    echo "Error: Username might already be taken.";
}
?>