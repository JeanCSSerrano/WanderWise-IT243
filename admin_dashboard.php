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
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Lakative</title>
    <link rel="stylesheet" href="stylesheets.css">
</head>
<body class="admin-page-body">
    <div class="header-bar">
        <div class="header-elements">
            <div class="left-menu">
                <div class="logo">
                    <img src="images/icons8-location-48.png" alt="Lakative logo">
                </div>
                <div class="header-text">
                    <p id="Wise">Lakative</p>
                    <p id="Tagline">Admin Dashboard</p>
                </div>
            </div>
            <div class="right-menu">
                <a href="index.php" class="login-btn">Back to Map</a>
            </div>
        </div>
    </div>

    <div class="admin-container">
        <h1 style="color: black; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">Welcome, <?php echo $_SESSION['username']; ?></h1>
        <div class="tool-grid">
            <div class="tool-card">
                <h3>Manage Locations</h3>
                <p>Add and Delete locations</p>
                <a href="add_location.php" class="auth-btn">Manage Places</a>
            </div>
            
            <div class="tool-card">
                <h3>Manage Comments</h3>
                <p>View and Delete comments</p>
                <a href="manage_comments.php" class="auth-btn">Manage</a>
            </div>
        </div>
    </div>
</body>
</html>