<?php
/**
 * Image Protection Script
 * Serves images only to authorized requests
 */

// Check if the request is coming from your website
$allowed_referers = [
    'samudrafm.com',
    'www.samudrafm.com',
    'localhost',
    '127.0.0.1'
];

$referer = $_SERVER['HTTP_REFERER'] ?? '';
$is_authorized = false;

foreach ($allowed_referers as $allowed) {
    if (strpos($referer, $allowed) !== false) {
        $is_authorized = true;
        break;
    }
}

// If not authorized, return 403 Forbidden
if (!$is_authorized) {
    http_response_code(403);
    die('Access denied');
}

// Get the requested image
$image_path = $_GET['img'] ?? '';
$allowed_images = [
    'SamudraFMLogo1.png',
    'SamudraFMLogo1transparent.png'
];

// Validate image name
if (!in_array($image_path, $allowed_images)) {
    http_response_code(404);
    die('Image not found');
}

$full_path = __DIR__ . '/images/' . $image_path;

// Check if file exists
if (!file_exists($full_path)) {
    http_response_code(404);
    die('Image not found');
}

// Set appropriate headers
$mime_type = mime_content_type($full_path);
header('Content-Type: ' . $mime_type);
header('Content-Length: ' . filesize($full_path));
header('Cache-Control: private, max-age=3600'); // Cache for 1 hour
header('X-Content-Type-Options: nosniff');

// Serve the image
readfile($full_path);
?>
