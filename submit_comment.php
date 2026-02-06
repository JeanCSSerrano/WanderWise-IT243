<?php
session_start();
include 'db_connect.php';
include 'logger.php'; 

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'You must be logged in.']);
    exit();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $user_id = $_SESSION['user_id'];
    $username = $_SESSION['username'] ?? 'Unknown';
    $location_id = $_POST['location_id'];
    $comment = trim($_POST['comment_text']);
    $parent_id = !empty($_POST['parent_id']) ? $_POST['parent_id'] : NULL;

    // BAD WORD FILTER
    $bad_words = ['fuck', 'shit', 'bitch', 'asshole', 'bastard', 'dick', 'pussy', 'cock', 'whore', 'slut', 'cunt', 'motherfucker', 'tits', 'bullshit', 'piss', 'douche', 'crap', 'damn', 'tanga', 'bobo', 'gago', 'putangina', 'tangina'];
    
    foreach ($bad_words as $word) {
        if (stripos($comment, $word) !== false) {
            // Log Toxicity (No comment ID yet because it failed)
            logActivity("Blocked Toxic Comment", "User tried: '$comment'", $location_id, NULL, NULL);
            echo json_encode(['status' => 'error', 'message' => 'Please use appropriate language']);
            exit(); 
        }
    }

    try {
        // GET PLACE NAME FOR READABILITY
        $locStmt = $conn->prepare("SELECT name FROM locations WHERE id = ?");
        $locStmt->execute([$location_id]);
        $placeName = $locStmt->fetchColumn() ?: "Unknown Place";

        // INSERT
        $stmt = $conn->prepare("INSERT INTO comments (user_id, location_id, comment_text, parent_id) VALUES (:uid, :lid, :txt, :pid)");
        $stmt->execute([
            ':uid' => $user_id,
            ':lid' => $location_id,
            ':txt' => $comment,
            ':pid' => $parent_id 
        ]);

        // *** NEW: GET THE ID OF THE COMMENT WE JUST MADE ***
        $newCommentId = $conn->lastInsertId();

        // LOG WITH COMMENT ID
        logActivity("Post Comment", "Posted: '$comment' on $placeName", $location_id, $newCommentId, NULL);

        echo json_encode(['status' => 'success', 'message' => 'Comment posted!']);

    } catch(PDOException $e) {
        logActivity("DB Error", $e->getMessage());
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    }
}
?>