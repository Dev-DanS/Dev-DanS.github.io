<?php
// Include your database connection code here, e.g., connecting to MySQL
// Example connection using PDO:
$host = "localhost";
$database = "livetracking";
$username = "root";
$password = "";

try {
    $conn = new PDO("mysql:host=$host;dbname=$database", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get the latitude and longitude from the request
    $lat = $_POST["lat"];
    $lng = $_POST["lng"];

    // Insert the data into the "live" table
    $sql = "INSERT INTO live (LiveLat, LiveLng, DateUpdated) VALUES (:lat, :lng, NOW())";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(":lat", $lat);
    $stmt->bindParam(":lng", $lng);

    if ($stmt->execute()) {
        echo "Location saved successfully";
    } else {
        echo "Error saving location";
    }
}
?>