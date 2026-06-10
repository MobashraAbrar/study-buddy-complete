<?php
$host = "localhost";
$db   = "study_buddy";
$user = "root";
$pass = "root";
$port = 3306;

$conn = new mysqli($host, $user, $pass, $db, $port);

if ($conn->connect_error) {
    header("Content-Type: application/json");
    die(json_encode(["success" => false, "message" => "DB Error: " . $conn->connect_error]));
}

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}
?>