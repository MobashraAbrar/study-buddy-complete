<?php
require 'db.php';

$user_id = intval($_GET['user_id'] ?? 0);

if (!$user_id) {
    echo json_encode(["success" => false, "message" => "user_id required"]);
    exit;
}

$stmt = $conn->prepare("
    SELECT p.id, p.session_id, p.focus_level, p.productivity_score, p.created_at
    FROM predictions p
    JOIN study_sessions s ON p.session_id = s.id
    WHERE s.user_id = ?
    ORDER BY p.created_at DESC
");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$predictions = [];
while ($row = $result->fetch_assoc()) {
    $predictions[] = $row;
}

echo json_encode(["success" => true, "predictions" => $predictions]);
?>