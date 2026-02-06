<?php
require_once 'db_connect.php';

function logActivity($action_type, $details = "", $loc_id = NULL, $com_id = NULL, $chat_id = NULL) {
    global $conn; 

    date_default_timezone_set('Asia/Manila');

    $user_id = NULL; 
    if (isset($_SESSION['user_id'])) {
        $user_id = $_SESSION['user_id'];
    }

    $ip_address = $_SERVER['REMOTE_ADDR'];

    try {
        $stmt = $conn->prepare("INSERT INTO activity_logs 
            (user_id, location_id, comment_id, global_chat_id, action_type, details, ip_address) 
            VALUES (?, ?, ?, ?, ?, ?, ?)");
            
        $stmt->execute([$user_id, $loc_id, $com_id, $chat_id, $action_type, $details, $ip_address]);
        
    } catch (PDOException $e) {
        $entry = "[" . date("Y-m-d H:i:s") . "] DB LOG ERROR: " . $e->getMessage() . PHP_EOL;
        file_put_contents("error_log.txt", $entry, FILE_APPEND);
    }
}
?>