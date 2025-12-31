# SamudraFM Instagram Auto-Update Script
# This script helps download and update Instagram posts for the website
# Usage: .\update-instagram.ps1

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  SamudraFM Instagram Post Updater" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$customPostsPath = "custom-posts.json"
$imagesPath = "images/CustomPost"

# Ensure images directory exists
if (-not (Test-Path $imagesPath)) {
    New-Item -ItemType Directory -Path $imagesPath -Force | Out-Null
    Write-Host "Created images directory: $imagesPath" -ForegroundColor Green
}

# Function to download an image from URL
function Download-InstagramImage {
    param (
        [string]$ImageUrl,
        [string]$FileName
    )
    
    try {
        $outputPath = "$imagesPath/$FileName"
        Invoke-WebRequest -Uri $ImageUrl -OutFile $outputPath -ErrorAction Stop
        Write-Host "  Downloaded: $FileName" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "  Failed to download: $FileName - $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Function to add a new post
function Add-NewPost {
    Write-Host ""
    Write-Host "--- Add New Instagram Post ---" -ForegroundColor Yellow
    Write-Host ""
    
    # Read current posts
    $postsData = Get-Content $customPostsPath -Raw | ConvertFrom-Json
    
    # Get next ID
    $maxId = ($postsData.posts | ForEach-Object { [int]$_.id } | Measure-Object -Maximum).Maximum
    $newId = ($maxId + 1).ToString()
    
    Write-Host "Post ID: $newId" -ForegroundColor Cyan
    
    # Get post details from user
    $title = Read-Host "Enter post title"
    $content = Read-Host "Enter post content/description"
    $link = Read-Host "Enter Instagram post URL (e.g., https://www.instagram.com/p/XXXXX/)"
    $date = Read-Host "Enter post date (YYYY-MM-DD format)"
    
    # Image handling
    Write-Host ""
    Write-Host "Image Options:" -ForegroundColor Yellow
    Write-Host "1. Enter image URL to download"
    Write-Host "2. Manually place image in $imagesPath and enter filename"
    $imageChoice = Read-Host "Choose option (1 or 2)"
    
    $imageFileName = ""
    if ($imageChoice -eq "1") {
        $imageUrl = Read-Host "Enter image URL"
        $imageFileName = "post${newId}_$(Get-Date -Format 'yyyyMMdd').jpg"
        $success = Download-InstagramImage -ImageUrl $imageUrl -FileName $imageFileName
        if (-not $success) {
            Write-Host "Image download failed. Please manually add the image." -ForegroundColor Red
            $imageFileName = Read-Host "Enter the filename you will use"
        }
    }
    else {
        $imageFileName = Read-Host "Enter image filename (must be in $imagesPath)"
    }
    
    # Create new post object
    $newPost = @{
        id = $newId
        title = $title
        content = $content
        image = "images/CustomPost/$imageFileName"
        link = $link
        date = "${date}T00:00:00.000Z"
    }
    
    # Insert at the beginning of the posts array
    $allPosts = @($newPost) + $postsData.posts
    $postsData.posts = $allPosts
    
    # Save updated posts
    $postsData | ConvertTo-Json -Depth 10 | Set-Content $customPostsPath -Encoding UTF8
    
    Write-Host ""
    Write-Host "Post added successfully!" -ForegroundColor Green
    Write-Host "Post ID: $newId" -ForegroundColor Cyan
    Write-Host "Title: $title" -ForegroundColor Cyan
    Write-Host "Image: images/CustomPost/$imageFileName" -ForegroundColor Cyan
}

# Function to list current posts
function Show-CurrentPosts {
    Write-Host ""
    Write-Host "--- Current Posts ---" -ForegroundColor Yellow
    Write-Host ""
    
    $postsData = Get-Content $customPostsPath -Raw | ConvertFrom-Json
    
    foreach ($post in $postsData.posts | Select-Object -First 10) {
        Write-Host "[$($post.id)] $($post.title)" -ForegroundColor Cyan
        Write-Host "    Date: $($post.date.Substring(0,10))" -ForegroundColor Gray
        Write-Host "    Image: $($post.image)" -ForegroundColor Gray
        Write-Host ""
    }
    
    $totalPosts = $postsData.posts.Count
    if ($totalPosts -gt 10) {
        Write-Host "... and $($totalPosts - 10) more posts" -ForegroundColor Gray
    }
    Write-Host "Total: $totalPosts posts" -ForegroundColor Green
}

# Function to verify images
function Test-PostImages {
    Write-Host ""
    Write-Host "--- Verifying Post Images ---" -ForegroundColor Yellow
    Write-Host ""
    
    $postsData = Get-Content $customPostsPath -Raw | ConvertFrom-Json
    $missingCount = 0
    
    foreach ($post in $postsData.posts) {
        if (-not (Test-Path $post.image)) {
            Write-Host "MISSING: [$($post.id)] $($post.image)" -ForegroundColor Red
            $missingCount++
        }
    }
    
    if ($missingCount -eq 0) {
        Write-Host "All images are present!" -ForegroundColor Green
    }
    else {
        Write-Host ""
        Write-Host "$missingCount image(s) missing" -ForegroundColor Red
    }
}

# Main menu
function Show-Menu {
    Write-Host ""
    Write-Host "What would you like to do?" -ForegroundColor Yellow
    Write-Host "1. Add new Instagram post"
    Write-Host "2. List current posts"
    Write-Host "3. Verify all images exist"
    Write-Host "4. Exit"
    Write-Host ""
}

# Main loop
$running = $true
while ($running) {
    Show-Menu
    $choice = Read-Host "Enter choice (1-4)"
    
    switch ($choice) {
        "1" { Add-NewPost }
        "2" { Show-CurrentPosts }
        "3" { Test-PostImages }
        "4" { 
            $running = $false
            Write-Host ""
            Write-Host "Goodbye!" -ForegroundColor Cyan
        }
        default {
            Write-Host "Invalid choice. Please enter 1-4." -ForegroundColor Red
        }
    }
}



