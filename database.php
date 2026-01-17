<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "wanderwise_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM locations";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $locations[] = array(
            "id" => $row["id"],
            "name" => $row["name"],
            "lat" => $row["lat"],
            "lng" => $row["lng"],
            "venue_address" => $row["venue_address"],
            "desc" => $row["description"],
            "image" => $row["image_url"],
            "open_time" => $row["open_time"],
            "close_time" => $row["close_time"],
            
        );
    }
}

header('Content-Type: application/json');
echo json_encode($locations);

$conn->close();
?>