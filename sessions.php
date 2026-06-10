<?php
require 'db.php';

$user_id = intval($_GET['user_id'] ?? 0);

if (!$user_id) {
    echo json_encode(["success" => false, "message" => "user_id required"]);
    exit;
}

$stmt = $conn->prepare("
    SELECT s.id, s.subject, s.duration, s.sessions_per_day, s.break_time, s.time_of_day, s.created_at,
           p.focus_level, p.productivity_score
    FROM study_sessions s
    LEFT JOIN predictions p ON p.session_id = s.id
    WHERE s.user_id = ?
    ORDER BY s.created_at DESC
");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$sessions = [];
while ($row = $result->fetch_assoc()) {
    $sessions[] = $row;
}

echo json_encode(["success" => true, "sessions" => $sessions]);
?>