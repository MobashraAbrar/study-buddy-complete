<?php
require 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

$email    = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

if (!$email || !$password) {
    echo json_encode(["success" => false, "message" => "Email and password required"]);
    exit;
}

$stmt = $conn->prepare("SELECT id, name, password_hash FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->bind_result($id, $name, $hash);
$stmt->fetch();

if (!$id || !password_verify($password, $hash)) {
    echo json_encode(["success" => false, "message" => "Invalid email or password"]);
    exit;
}

echo json_encode([
    "success" => true,
    "user" => ["id" => $id, "name" => $name, "email" => $email]
]);
?>