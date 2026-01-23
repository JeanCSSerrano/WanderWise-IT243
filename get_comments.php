<?php
include 'db_connect.php'; // Keep PDO consistency

if (isset($_GET['location_id'])) {
    $loc_id = $_GET['location_id'];

    // FIX: Added 'comments.id' and 'comments.parent_id' to the list
    $sql = "SELECT comments.id, comments.parent_id, comments.comment_text, comments.created_at, users.username 
            FROM comments 
            JOIN users ON comments.user_id = users.id 
            WHERE comments.location_id = ? 
            ORDER BY comments.created_at DESC";

    $stmt = $conn->prepare($sql);
    $stmt->execute([$loc_id]);
    $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($comments);
}
?>