<?php
session_start();
include 'db_connect.php';

// Security Check
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
    <title>Manage Comments - Admin</title>
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

    <div class="header-bar">
        <div class="header-elements">
            <div class="left-menu">
                <div class="logo"><img src="images/icons8-location-48.png" alt="Logo"></div>
                <div class="header-text">
                    <p id="Wise">Lakative</p>
                    <p id="Tagline">Admin Panel</p>
                </div>
            </div>
            <div class="right-menu">
                <a href="admin_dashboard.php" class="login-btn">Back to Dashboard</a>
            </div>
        </div>
    </div>

    <div class="admin-container">
        <div class="admin-form-wrapper wrapper-wide"> 
            
            <div class="admin-header">
                <h2>Moderate Comments (<?php echo count($comments); ?>)</h2>
            </div>

            <?php if(isset($_SESSION['success'])): ?>
                <div class="alert alert-success"><?php echo $_SESSION['success']; unset($_SESSION['success']); ?></div>
            <?php endif; ?>

            <div class="table-scroll-wrapper large-table">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th class="th-user">User</th>
                            <th class="th-place">Place</th>
                            <th class="th-comment">Comment</th>
                            <th class="th-date">Date</th>
                            <th class="th-action">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($comments as $c): ?>
                        <tr>
                            <td><strong><?php echo htmlspecialchars($c['username']); ?></strong></td>
                            <td class="td-place"><?php echo htmlspecialchars($c['place_name']); ?></td>
                            <td><?php echo htmlspecialchars($c['comment_text']); ?></td>
                            <td class="td-date"><?php echo date('M d', strtotime($c['created_at'])); ?></td>
                            <td>
                                <button onclick="confirmDelete(<?php echo $c['id']; ?>)" class="btn-delete">Delete</button>
                            </td>
                        </tr>
                        <?php endforeach; ?>

                        <?php if(count($comments) == 0): ?>
                            <tr><td colspan="5" class="empty-row">No comments yet.</td></tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>

        </div>
    </div>

</body>
</html>