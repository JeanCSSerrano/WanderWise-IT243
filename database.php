<?php

include 'db_connect.php'; 

header('Content-Type: application/json');

try {
    
    $stmt = $conn->prepare("SELECT * FROM locations");
    $stmt->execute();
    
    
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $locations = [];

   
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

    echo json_encode([]);
}
?>