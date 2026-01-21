<?php
include 'db_connect.php';

if (isset($_GET['location_id'])) {
    $loc_id = $_GET['location_id'];

    
    $sql = "SELECT comments.comment_text, comments.created_at, users.username 
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