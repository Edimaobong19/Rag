@echo off
echo ====================================
echo Starting Frontend Development Server...
echo ====================================
echo.
cd /d "%~dp0frontend"
powershell -ExecutionPolicy Bypass -Command "npm run dev"
pause
