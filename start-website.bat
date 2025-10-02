@echo off
echo Starting SamudraFM website server...
cd /d "%~dp0"
echo.
echo Your website will be available at:
echo PC: http://localhost:8080
echo Mobile: http://192.168.11.202:8080
echo.
echo Press any key to start the server...
pause >nul
start /B python -m http.server 8080
echo Server started! Press any key to stop...
pause >nul
taskkill /F /IM python.exe
echo Server stopped.

