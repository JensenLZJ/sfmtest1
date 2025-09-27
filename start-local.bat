@echo off
echo Starting SamudraFM Local Server...
echo.
echo This will start a simple HTTP server to view your website locally.
echo The server will run on http://localhost:8080
echo.
echo Press Ctrl+C to stop the server when you're done.
echo.

REM Try to use PowerShell's built-in web server
powershell -Command "& {Add-Type -AssemblyName System.Web; $listener = New-Object System.Net.HttpListener; $listener.Prefixes.Add('http://localhost:8080/'); $listener.Start(); Write-Host 'Server running at http://localhost:8080'; Write-Host 'Press Ctrl+C to stop'; try { while ($listener.IsListening) { $context = $listener.GetContext(); $request = $context.Request; $response = $context.Response; $localPath = $request.Url.LocalPath; if ($localPath -eq '/') { $localPath = '/index.html' }; $filePath = Join-Path $PWD $localPath.TrimStart('/'); if (Test-Path $filePath) { $content = [System.IO.File]::ReadAllBytes($filePath); $response.ContentLength64 = $content.Length; $response.OutputStream.Write($content, 0, $content.Length) } else { $response.StatusCode = 404; $content = [System.Text.Encoding]::UTF8.GetBytes('404 Not Found'); $response.ContentLength64 = $content.Length; $response.OutputStream.Write($content, 0, $content.Length) }; $response.OutputStream.Close() } } finally { $listener.Stop() } }"

pause
