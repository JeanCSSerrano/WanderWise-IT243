<?php
session_start();
include 'db_connect.php'; 

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    
    $name = trim($_POST['name']);
    $address = trim($_POST['address']);
    $desc = trim($_POST['description']);
    $image = trim($_POST['image_url']) ?: 'images/default.jpg';
    $open = !empty($_POST['open_time']) ? $_POST['open_time'] : 0;
    $close = !empty($_POST['close_time']) ? $_POST['close_time'] : 24;
    $lat = trim($_POST['manual_lat']);
    $lng = trim($_POST['manual_lng']);

    if (empty($lat) || empty($lng)) {
        $_SESSION['error'] = "Error";
        header("Location: add_location.php");
        exit();
    }

    // VERIFY SA BESTTIME API 
    $api_key_private = "pri_7dc8d4ae59904a658f8ecb9488cded6b"; 
    $bt_name = urlencode($name);
    $bt_address = urlencode($address);
    
    $bt_url = "https://besttime.app/api/v1/forecasts?venue_name={$bt_name}&venue_address={$bt_address}&api_key_private={$api_key_private}";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $bt_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POST, 1);
    $bt_response = curl_exec($ch);
    $bt_data = json_decode($bt_response, true);
    curl_close($ch);

    if (!isset($bt_data['status']) || $bt_data['status'] == "error") {
        $_SESSION['error'] = "Error.";
        header("Location: add_location.php");
        exit();
    }

    try {
        // SAVE TO DATABASE
        $sql = "INSERT INTO locations (name, lat, lng, venue_address, description, image_url, open_time, close_time) 
                VALUES (:name, :lat, :lng, :addr, :desc, :img, :open, :close)";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ':name' => $name,
            ':lat' => $lat,
            ':lng' => $lng,
            ':addr' => $address,
            ':desc' => $desc,
            ':img' => $image,
            ':open' => $open,
            ':close' => $close
        ]);

        $_SESSION['success'] = "Success! Location added at GPS: $lat, $lng";
        header("Location: add_location.php");
        exit();

    } catch(PDOException $e) {
        $_SESSION['error'] = "Database Error: " . $e->getMessage();
        header("Location: add_location.php");
        exit();
    }

} else {
    header("Location: add_location.php");
    exit();
}
?>