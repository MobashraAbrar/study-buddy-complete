<?php
require 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

$user_id          = intval($data['user_id'] ?? 0);
$subject          = trim($data['subject'] ?? '');
$duration         = floatval($data['duration'] ?? 0);
$sessions_per_day = floatval($data['sessions_per_day'] ?? 1);
$break_time       = floatval($data['break_time'] ?? 0);
$time_of_day      = intval($data['time_of_day'] ?? 0);

if (!$user_id || !$subject || !$duration) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

// Save session to database
$stmt = $conn->prepare("INSERT INTO study_sessions (user_id, subject, duration, sessions_per_day, break_time, time_of_day) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("isdddi", $user_id, $subject, $duration, $sessions_per_day, $break_time, $time_of_day);

if (!$stmt->execute()) {
    echo json_encode(["success" => false, "message" => "Failed to save session"]);
    exit;
}

$session_id = $conn->insert_id;

// Try Flask first
$flask_url  = "http://127.0.0.1:5000/predict";
$flask_data = json_encode([
    "duration"         => $duration,
    "time_of_day"      => $time_of_day,
    "sessions_per_day" => $sessions_per_day,
    "break_time"       => $break_time
]);

$ch = curl_init($flask_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $flask_data);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);
$response   = curl_exec($ch);
$curl_error = curl_error($ch);
curl_close($ch);

$flask_ok = !$curl_error && $response;

if ($flask_ok) {
    $result             = json_decode($response, true);
    $focus_level        = intval($result['focus_level'] ?? 1);
    $productivity_score = round(floatval($result['productivity_score'] ?? 50), 1);
} else {
    // Flask not running — calculate score using our own logic
    // Base score from duration (longer = better, up to 120 min)
    $duration_score = min($duration / 120, 1) * 40;

    // Time of day bonus (morning=best, night=worst)
    $time_bonus = [0 => 20, 1 => 15, 2 => 10, 3 => 5][$time_of_day] ?? 10;

    // Sessions per day bonus (2-3 sessions is ideal)
    if ($sessions_per_day <= 1) $session_bonus = 10;
    elseif ($sessions_per_day <= 3) $session_bonus = 20;
    elseif ($sessions_per_day <= 5) $session_bonus = 15;
    else $session_bonus = 5;

    // Break time bonus (10-20 min break is ideal)
    if ($break_time >= 10 && $break_time <= 20) $break_bonus = 20;
    elseif ($break_time > 0 && $break_time < 10) $break_bonus = 12;
    elseif ($break_time > 20) $break_bonus = 8;
    else $break_bonus = 5; // no break

    $productivity_score = round($duration_score + $time_bonus + $session_bonus + $break_bonus, 1);
    $productivity_score = max(30, min(100, $productivity_score));

    // Focus level based on productivity score
    if ($productivity_score >= 75) $focus_level = 2;      // High
    elseif ($productivity_score >= 50) $focus_level = 1;  // Medium
    else $focus_level = 0;                                 // Low
}

// Save prediction
$pred = $conn->prepare("INSERT INTO predictions (session_id, focus_level, productivity_score) VALUES (?, ?, ?)");
$pred->bind_param("iid", $session_id, $focus_level, $productivity_score);
$pred->execute();

echo json_encode([
    "success"            => true,
    "session_id"         => $session_id,
    "focus_level"        => $focus_level,
    "productivity_score" => $productivity_score,
    "source"             => $flask_ok ? "flask" : "builtin"
]);
?>