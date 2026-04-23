@echo off
echo ====================================
echo Starting Backend Server...
echo ====================================
echo.
cd /d "%~dp0backend"
python app.py
pause
