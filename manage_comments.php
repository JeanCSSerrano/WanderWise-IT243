<?php
session_start();
include 'db_connect.php';

// CHECK IF USER ADMIN
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    header("Location: login.php");
    exit();
}

// FETCH ALL COMMENTS
$sql = "SELECT c.id, c.comment_text, c.created_at, u.username, l.name as place_name 
        FROM comments c 
        JOIN users u ON c.user_id = u.id 
        JOIN locations l ON c.location_id = l.id 
        ORDER BY c.created_at DESC";
$stmt = $conn->prepare($sql);
$stmt->execute();
$comments = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Moderate Discussion - Lakative</title>
    <link rel="stylesheet" href="stylesheets.css?v=<?php echo time(); ?>">
    <script>
        function confirmDelete(id) {
            if (confirm("Permanently delete this comment?")) {
                window.location.href = "delete_comment.php?id=" + id;
            }
        }
    </script>
</head>
<body class="admin-page-body">

    <header class="header-bar">
        <div class="header-elements">
            <div class="left-menu">
                <div class="logo">
                    <img src="images/LakativeLogo-real.png" alt="Logo">
                </div>
                <div class="header-text">
                    <p id="Wise">Lakative</p>
                    <p id="Tagline">Moderate Discussion</p>
                </div>
            </div>
            <div class="right-menu">
                <a href="admin_dashboard.php" class="login-btn">Back to Dashboard</a>
            </div>
        </div>
    </header>

    <div class="admin-container">
        <div class="admin-form-wrapper"> 
            
            <div class="welcome-section">
                <h1>Manage Comments</h1>
                <p>Monitor and remove inappropriate user feedback.</p>
            </div>

            <?php if(isset($_SESSION['success'])): ?>
                <div class="alert alert-success" style="color: #2ecc71; margin-bottom: 15px; font-weight: bold;">
                    <?php echo $_SESSION['success']; unset($_SESSION['success']); ?>
                </div>
            <?php endif; ?>

            <div class="table-scroll-wrapper">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Comment</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($comments as $c): ?>
                        <tr>
                            <td>
                                <strong><?php echo htmlspecialchars($c['username']); ?></strong><br>
                                <small style="color: var(--text-light);"><?php echo htmlspecialchars($c['place_name']); ?></small>
                            </td>
                            <td>
                                <p style="margin: 0; font-size: 14px;"><?php echo htmlspecialchars($c['comment_text']); ?></p>
                                <small style="color: var(--text-light);"><?php echo date('M d, g:i A', strtotime($c['created_at'])); ?></small>
                            </td>
                            <td>
                                <button onclick="confirmDelete(<?php echo $c['id']; ?>)" class="btn-delete">Delete</button>
                            </td>
                        </tr>
                        <?php endforeach; ?>

                        <?php if(count($comments) == 0): ?>
                            <tr><td colspan="3" class="empty-row" style="text-align: center; padding: 20px;">No comments yet.</td></tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>

        </div>
    </div>

    </body>
</html>