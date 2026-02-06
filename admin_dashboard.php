<?php
session_start();
include 'db_connect.php';

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    header("Location: index.php"); 
    exit();
}

$loc_stmt = $conn->query("SELECT COUNT(*) FROM locations");
$total_locations = $loc_stmt->fetchColumn();


$comm_stmt = $conn->query("SELECT COUNT(*) FROM comments");
$total_comments = $comm_stmt->fetchColumn();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Lakative</title>
    <link rel="stylesheet" href="stylesheets.css?v=<?php echo time(); ?>">
</head>
<body class="admin-page-body">
    <div class="header-bar">
        <div class="header-elements">
            <div class="left-menu">
                <div class="logo">
                    <img src="images/LakativeLogo-real.png" alt="Lakative logo">
                </div>
                <div class="header-text">
                    <p id="Wise">Lakative</p>
                    <p id="Tagline">Admin Dashboard</p>
                </div>
            </div>
            <div class="right-menu">
                <button class="theme-toggle" id="themeToggle" onclick="toggleTheme()" style="margin-right: 10px;">
                    <span id="themeIcon">🌙</span>
                </button>
                <a href="index.php" class="login-btn">Back to Map</a>
            </div>
        </div>
    </div>

    <div class="admin-container">
        
        <div class="welcome-section">
            <h1 style="text-shadow: 0 2px 4px rgba(0,0,0,0.1);">Welcome back, <?php echo htmlspecialchars($_SESSION['username']); ?>!</h1>
        </div>

        <div class="tool-grid">
            
            <div class="tool-card">
                <span class="tool-icon">📍</span>
                <h3>Locations</h3>
                <div class="stat-number"><?php echo $total_locations; ?></div>
                <p style="margin-bottom: 20px;">Active places on the map</p>
                <a href="add_location.php" class="auth-btn">Manage Places</a>
            </div>
            
            <div class="tool-card">
                <span class="tool-icon">💬</span>
                <h3>User Reviews</h3>
                <div class="stat-number"><?php echo $total_comments; ?></div>
                <p style="margin-bottom: 20px;">Total comments posted</p>
                <a href="manage_comments.php" class="auth-btn">Moderate</a>
            </div>

            <div class="tool-card">
                <span class="tool-icon">💾</span>
                <h3>Database Backup</h3>
                <div class="stat-number">SQL</div>
                <p style="margin-bottom: 20px;">Download a copy of the database</p>
                <a href="backup.php" class="auth-btn" style="background-color: #2ecc71;">Download Backup</a>
            </div>
        </div>
    </div>

    <script src="index.js"></script>
</body>
</html>