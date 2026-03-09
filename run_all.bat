@echo off
echo ==============================================
echo    Starting Edge-AI Security Dashboard
echo ==============================================

echo [1/2] Starting Python AI Backend (YOLOv8)...
start cmd /k "python python_server.py"

echo [2/2] Starting React Frontend...
start cmd /k "npm run dev"

echo.
echo Both servers are starting in separate windows.
echo - AI Backend will run on http://localhost:5000
echo - Frontend will run on http://localhost:5173
echo.
echo Please allow a few seconds for the YOLO model to initialize.
pause
