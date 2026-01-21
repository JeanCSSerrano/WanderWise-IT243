<?php
session_start();
include 'db_connect.php';

header('Content-Type: application/json');

// 1. Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'You must be logged in.']);
    exit();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $user_id = $_SESSION['user_id'];
    $location_id = $_POST['location_id'];
    $comment = trim($_POST['comment_text']);

    // --- 🛑 SERVER-SIDE BAD WORD FILTER ---
    // Even if they bypass JS, they can't bypass this.
    $bad_words = ['badword1', 'badword2', 'stupid', 'ugly', 'scam', 'fake']; 
    
    foreach ($bad_words as $word) {
        // stripos is case-insensitive
        if (stripos($comment, $word) !== false) {
            echo json_encode(['status' => 'error', 'message' => 'Comment contains inappropriate language.']);
            exit(); 
        }
    }
    // ------------------------------------

    try {
        $stmt = $conn->prepare("INSERT INTO comments (user_id, location_id, comment_text) VALUES (:uid, :lid, :txt)");
        $stmt->execute([
            ':uid' => $user_id,
            ':lid' => $location_id,
            ':txt' => $comment
        ]);

        echo json_encode(['status' => 'success', 'message' => 'Comment posted!']);

    } catch(PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Database error.']);
    }
}
?>