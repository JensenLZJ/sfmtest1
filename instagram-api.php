<?php
// Instagram API Integration for SamudraFM
// This file handles Instagram Basic Display API integration

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Instagram API Configuration
// You'll need to get these from Facebook Developer Console
$INSTAGRAM_APP_ID = '1352509662973403';
$INSTAGRAM_APP_SECRET = '04fa33f39a09f3d7fec8425b54ff1326';
$INSTAGRAM_REDIRECT_URI = 'https://yourdomain.com/instagram-callback.php';
$INSTAGRAM_ACCESS_TOKEN = 'YOUR_LONG_LIVED_ACCESS_TOKEN';

// Function to get Instagram posts
function getInstagramPosts($accessToken) {
    $url = "https://graph.instagram.com/me/media?fields=id,media_type,media_url,permalink,caption,timestamp&access_token=" . $accessToken;
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        return json_decode($response, true);
    } else {
        return false;
    }
}

// Function to refresh access token
function refreshAccessToken($accessToken) {
    $url = "https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=" . $accessToken;
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        return json_decode($response, true);
    } else {
        return false;
    }
}

// Main execution
try {
    // Check if access token is provided
    if (empty($INSTAGRAM_ACCESS_TOKEN) || $INSTAGRAM_ACCESS_TOKEN === 'YOUR_LONG_LIVED_ACCESS_TOKEN') {
        // Return mock data if no real token is configured
        $mockData = [
            'data' => [
                [
                    'id' => '1',
                    'media_type' => 'IMAGE',
                    'media_url' => 'https://via.placeholder.com/400x400/f61b58/ffffff?text=New+Music+Friday',
                    'permalink' => 'https://www.instagram.com/p/mock1/',
                    'caption' => '🎵 New Music Friday is here! Tune in to SamudraFM for the latest hits and student favorites. #SamudraFM #NewMusicFriday #StudentRadio',
                    'timestamp' => date('c', time() - 2 * 60 * 60) // 2 hours ago
                ],
                [
                    'id' => '2',
                    'media_type' => 'VIDEO',
                    'media_url' => 'https://via.placeholder.com/400x400/8b4c93/ffffff?text=Live+Show',
                    'permalink' => 'https://www.instagram.com/p/mock2/',
                    'caption' => '🎙️ Live show tonight! Join us for an amazing evening of music and entertainment. #SamudraFM #LiveShow #Tonight',
                    'timestamp' => date('c', time() - 24 * 60 * 60) // 1 day ago
                ],
                [
                    'id' => '3',
                    'media_type' => 'IMAGE',
                    'media_url' => 'https://via.placeholder.com/400x400/4a2c8a/ffffff?text=Behind+Scenes',
                    'permalink' => 'https://www.instagram.com/p/mock3/',
                    'caption' => 'Behind the scenes at SamudraFM! Our amazing team working hard to bring you the best radio experience. #SamudraFM #BehindTheScenes #Team',
                    'timestamp' => date('c', time() - 3 * 24 * 60 * 60) // 3 days ago
                ],
                [
                    'id' => '4',
                    'media_type' => 'IMAGE',
                    'media_url' => 'https://via.placeholder.com/400x400/6b4c93/ffffff?text=Student+Spotlight',
                    'permalink' => 'https://www.instagram.com/p/mock4/',
                    'caption' => '🌟 Student Spotlight: Meet our talented DJ who brings amazing energy to every show! #SamudraFM #StudentSpotlight #Talent',
                    'timestamp' => date('c', time() - 7 * 24 * 60 * 60) // 1 week ago
                ]
            ]
        ];
        
        echo json_encode($mockData);
        exit();
    }
    
    // Try to get posts with current token
    $posts = getInstagramPosts($INSTAGRAM_ACCESS_TOKEN);
    
    if ($posts === false) {
        // Try to refresh the token
        $refreshResult = refreshAccessToken($INSTAGRAM_ACCESS_TOKEN);
        if ($refreshResult && isset($refreshResult['access_token'])) {
            $INSTAGRAM_ACCESS_TOKEN = $refreshResult['access_token'];
            $posts = getInstagramPosts($INSTAGRAM_ACCESS_TOKEN);
        }
    }
    
    if ($posts === false) {
        throw new Exception('Failed to fetch Instagram posts');
    }
    
    // Limit to 4 posts and format the response
    $limitedPosts = array_slice($posts['data'], 0, 4);
    
    echo json_encode([
        'success' => true,
        'data' => $limitedPosts
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
