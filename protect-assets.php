<?php
/**
 * Asset Protection Script
 * Place this file in your root directory and rename your assets folder to 'protected-assets'
 * Then update your HTML to use this script for serving protected files
 * 
 * Usage: protect-assets.php?file=images/SamudraFMLogo1.png
 */

// Configuration
$protectedDir = 'protected-assets';
$allowedReferers = [
    'samudrafm.com',
    'www.samudrafm.com',
    'samudrafm.github.io',
    'localhost' // for development
];

// Security headers
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('Referrer-Policy: strict-origin-when-cross-origin');

// Check if file parameter is provided
if (!isset($_GET['file']) || empty($_GET['file'])) {
    http_response_code(400);
    die('File parameter required');
}

$requestedFile = $_GET['file'];

// Security: prevent directory traversal
if (strpos($requestedFile, '..') !== false || strpos($requestedFile, '/') === 0) {
    http_response_code(403);
    die('Access denied');
}

// Check referer
$referer = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : '';
$refererHost = parse_url($referer, PHP_URL_HOST);
$isValidReferer = false;

foreach ($allowedReferers as $allowedReferer) {
    if ($refererHost === $allowedReferer || strpos($refererHost, $allowedReferer) !== false) {
        $isValidReferer = true;
        break;
    }
}

// Allow direct access from same domain
$currentHost = $_SERVER['HTTP_HOST'];
foreach ($allowedReferers as $allowedReferer) {
    if ($currentHost === $allowedReferer || strpos($currentHost, $allowedReferer) !== false) {
        $isValidReferer = true;
        break;
    }
}

if (!$isValidReferer) {
    http_response_code(403);
    die('Access denied: Invalid referer');
}

// Build file path
$filePath = $protectedDir . '/' . $requestedFile;

// Check if file exists
if (!file_exists($filePath)) {
    http_response_code(404);
    die('File not found');
}

// Get file info
$fileInfo = pathinfo($filePath);
$mimeType = '';

// Set appropriate MIME type
switch (strtolower($fileInfo['extension'])) {
    case 'png':
        $mimeType = 'image/png';
        break;
    case 'jpg':
    case 'jpeg':
        $mimeType = 'image/jpeg';
        break;
    case 'gif':
        $mimeType = 'image/gif';
        break;
    case 'svg':
        $mimeType = 'image/svg+xml';
        break;
    case 'ico':
        $mimeType = 'image/x-icon';
        break;
    case 'css':
        $mimeType = 'text/css';
        break;
    case 'js':
        $mimeType = 'application/javascript';
        break;
    case 'json':
        $mimeType = 'application/json';
        break;
    default:
        $mimeType = 'application/octet-stream';
}

// Set headers
header('Content-Type: ' . $mimeType);
header('Content-Length: ' . filesize($filePath));
header('Cache-Control: public, max-age=31536000'); // Cache for 1 year
header('Last-Modified: ' . gmdate('D, d M Y H:i:s', filemtime($filePath)) . ' GMT');

// Output file
readfile($filePath);
?>

