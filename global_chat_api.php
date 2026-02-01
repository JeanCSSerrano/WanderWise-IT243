<?php
session_start();
include 'db_connect.php';

header('Content-Type: application/json');

$action = $_POST['action'] ?? $_GET['action'] ?? '';

// 1. FETCH MESSAGES 
if ($action === 'fetch') {
    $sql = "SELECT c.message, c.created_at, u.username, u.id as user_id
            FROM global_chat c
            JOIN users u ON c.user_id = u.id
            ORDER BY c.created_at DESC LIMIT 50";
    
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(array_reverse($messages));
    exit();
}

// SEND MESSAGE
if ($action === 'send') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['status' => 'error', 'message' => 'Not logged in']);
        exit();
    }

    $message = trim($_POST['message']);
    if (empty($message)) {
        echo json_encode(['status' => 'error', 'message' => 'Empty message']);
        exit();
    }

    
    try {
        $stmt = $conn->prepare("INSERT INTO global_chat (user_id, message) VALUES (?, ?)");
        $stmt->execute([$_SESSION['user_id'], $message]);
        echo json_encode(['status' => 'success']);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Database error']);
    }
    exit();
}
?>