<?php
session_start();
include 'db_connect.php'; // Keeps your consistent PDO connection

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'You must be logged in.']);
    exit();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $user_id = $_SESSION['user_id'];
    $location_id = $_POST['location_id'];
    $comment = trim($_POST['comment_text']);
    
    // NEW: Check if this is a reply (it might be empty, that's ok)
    $parent_id = !empty($_POST['parent_id']) ? $_POST['parent_id'] : NULL;

    // Bad words filter (Keep your existing one)
    $bad_words = ['fuck', 'shit', 'bitch', 'asshole', 'bastard', 'dick', 'pussy', 'cock', 'whore', 'slut', 'cunt', 'motherfucker', 'tits', 'bullshit', 'piss', 'douche', 'crap', 'damn', 'tanga', 'bobo', 'gago', 'putangina', 'tangina'];
    
    foreach ($bad_words as $word) {
        if (stripos($comment, $word) !== false) {
            echo json_encode(['status' => 'error', 'message' => 'Please use appropriate language']);
            exit(); 
        }
    }

    try {
        // UPDATED SQL: Added parent_id column
        // We use :pid for the named parameter (PDO Style)
        $stmt = $conn->prepare("INSERT INTO comments (user_id, location_id, comment_text, parent_id) VALUES (:uid, :lid, :txt, :pid)");
        
        $stmt->execute([
            ':uid' => $user_id,
            ':lid' => $location_id,
            ':txt' => $comment,
            ':pid' => $parent_id // This handles both NULL and Numbers automatically
        ]);

        echo json_encode(['status' => 'success', 'message' => 'Comment posted!']);

    } catch(PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    }
}
?>