<?php
session_start();

// 🛑 SECURITY GATE: Check if user is actually an admin
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    header("Location: index.php"); 
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Dashboard - WanderWise</title>
    <link rel="stylesheet" href="stylesheets.css">
</head>
<body>
    <div class="header-bar">
        <div class="header-elements">
            <div class="left-menu">
                <div class="logo">
                    <img src="images/icons8-location-48.png" alt="WanderWise logo">
                </div>
                <div class="header-text">
                    <p id="Wise">Admin Control</p>
                </div>
            </div>
            <div class="right-menu">
                <a href="index.php" class="login-btn">Back to Map</a>
            </div>
        </div>
    </div>

    <div class="admin-container">
        <h1>Welcome, <?php echo $_SESSION['username']; ?></h1>
        <div class="tool-grid">
            <div class="tool-card">
                <h3>Manage Locations</h3>
                <p>Placeholder</p>
                <a href="add_location.php" class="auth-btn">Manage Places</a>
            </div>
            
            <div class="tool-card">
                <h3>placeholder</h3>
                <p>placeholder</p>
                <a href="#" class="auth-btn">Moderate</a>
            </div>
        </div>
    </div>
</body>
</html>