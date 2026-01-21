<?php
// 1. Use your existing PDO connection file
include 'db_connect.php'; 

header('Content-Type: application/json');

try {
    // 2. PDO Query Style
    $stmt = $conn->prepare("SELECT * FROM locations");
    $stmt->execute();
    
    // 3. Fetch All Data
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $locations = [];

    // 4. Loop and Format
    foreach($results as $row) {
        $locations[] = array(
            "id" => $row["id"],
            "name" => $row["name"],
            "lat" => $row["lat"],
            "lng" => $row["lng"],
            "venue_address" => $row["venue_address"],
            "desc" => $row["description"],
            "image" => $row["image_url"],
            "open_time" => $row["open_time"],
            "close_time" => $row["close_time"]
        );
    }

    echo json_encode($locations);

} catch(PDOException $e) {
    // If something goes wrong, send empty JSON or error
    echo json_encode([]);
}
?>