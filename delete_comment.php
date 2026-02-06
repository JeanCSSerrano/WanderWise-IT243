<?php
ob_start(); 
session_start();
include 'db_connect.php';
include 'logger.php'; 

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    header("Location: login.php");
    exit();
}

if (isset($_GET['id'])) {
    $id = $_GET['id'];
    $admin_user = $_SESSION['username'];

    try {
        // 1. Fetch data BEFORE deleting
        $fetchStmt = $conn->prepare("
            SELECT c.comment_text, l.name as place_name, c.location_id 
            FROM comments c 
            JOIN locations l ON c.location_id = l.id 
            WHERE c.id = :id
        ");
        $fetchStmt->execute([':id' => $id]);
        $data = $fetchStmt->fetch(PDO::FETCH_ASSOC);

        // 2. Perform the deletion
        $stmt = $conn->prepare("DELETE FROM comments WHERE id = :id");
        $stmt->execute([':id' => $id]);
        
        // 3. LOG THE DETAILS
        if ($data) {
            $logAction = "Delete Comment"; 
            $logDetails = "Admin removed comment: '" . $data['comment_text'] . "' from " . $data['place_name'];
            
            // FIX: Pass NULL for the comment_id, because the comment is gone!
            // We pass $data['location_id'] so it still links to the location.
            logActivity($logAction, $logDetails, $data['location_id'], NULL); 
        }

        $_SESSION['success'] = "Comment deleted successfully.";
    } catch(PDOException $e) {
        $_SESSION['error'] = "Error: " . $e->getMessage();
    }
}

header("Location: manage_comments.php");
exit();
?>