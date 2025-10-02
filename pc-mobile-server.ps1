# PC and Mobile Server - No admin required
param(
    [int]$Port = 5000
)

$root = Get-Location
$localIP = "192.168.11.202"

Write-Host "Starting HTTP server for PC and mobile access"
Write-Host "Serving files from: $root"
Write-Host "PC access: http://localhost:$Port"
Write-Host "Mobile access: http://$localIP`:$Port"

# Create HttpListener with localhost only (no admin required)
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Prefixes.Add("http://127.0.0.1:$Port/")

try {
    $listener.Start()
    Write-Host "Server started successfully!"
    Write-Host "PC: http://localhost:$Port"
    Write-Host "Mobile: http://$localIP`:$Port"
    Write-Host "Press Ctrl+C to stop."
    
    while ($listener.IsListening) {
        try {
            $context = $listener.GetContext()
            $request = $context.Request
            $response = $context.Response
            
            $localPath = $request.Url.LocalPath
            if ($localPath -eq "/") {
                $localPath = "/index.html"
            }
            
            # Try the original path first
            $filePath = Join-Path $root $localPath.TrimStart('/')
            
            # If file doesn't exist and doesn't have .html extension, try adding it
            if (-not (Test-Path $filePath -PathType Leaf) -and -not $localPath.EndsWith('.html')) {
                $filePath = Join-Path $root ($localPath.TrimStart('/') + '.html')
            }
            
            if (Test-Path $filePath -PathType Leaf) {
                $content = [System.IO.File]::ReadAllBytes($filePath)
                $response.ContentLength64 = $content.Length
                
                # Set content type based on file extension
                $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
                switch ($extension) {
                    ".html" { $response.ContentType = "text/html; charset=utf-8" }
                    ".css" { $response.ContentType = "text/css; charset=utf-8" }
                    ".js" { $response.ContentType = "application/javascript; charset=utf-8" }
                    ".json" { $response.ContentType = "application/json; charset=utf-8" }
                    ".png" { $response.ContentType = "image/png" }
                    ".jpg" { $response.ContentType = "image/jpeg" }
                    ".jpeg" { $response.ContentType = "image/jpeg" }
                    ".gif" { $response.ContentType = "image/gif" }
                    ".ico" { $response.ContentType = "image/x-icon" }
                    default { $response.ContentType = "text/plain; charset=utf-8" }
                }
                
                $response.OutputStream.Write($content, 0, $content.Length)
                Write-Host "Served: $localPath to $($request.RemoteEndPoint.Address)"
            } else {
                $response.StatusCode = 404
                $errorMessage = "File not found: $localPath"
                $errorBytes = [System.Text.Encoding]::UTF8.GetBytes($errorMessage)
                $response.ContentLength64 = $errorBytes.Length
                $response.OutputStream.Write($errorBytes, 0, $errorBytes.Length)
                Write-Host "404: $localPath from $($request.RemoteEndPoint.Address)"
            }
            
            $response.Close()
        } catch {
            Write-Host "Error processing request: $($_.Exception.Message)"
        }
    }
} catch {
    Write-Host "Error starting server: $($_.Exception.Message)"
} finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
    Write-Host "Server stopped."
}

