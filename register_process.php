<?php
include 'db_connect.php';

$user = $_POST['username'];
$pass = $_POST['password'];


$hashed_pass = password_hash($pass, PASSWORD_DEFAULT);

try {
    
    $stmt = $conn->prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)");
    $stmt->execute([$user, $hashed_pass]);
    
    
    header("Location: login.php?success=Account created!");
} catch (PDOException $e) {
    
    echo "Error: Username might already be taken.";
}
?>