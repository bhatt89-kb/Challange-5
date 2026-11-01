@echo off
echo ========================================
echo GenAI Event Planner - Development Server
echo ========================================
echo.

if not exist node_modules (
    echo ERROR: Dependencies not installed!
    echo Please run setup.bat first.
    echo.
    pause
    exit /b 1
)

if not exist .env (
    echo WARNING: .env file not found!
    echo Creating from template...
    copy .env.example .env
    echo.
    echo IMPORTANT: Please edit .env and add your GEMINI_API_KEY!
    echo Get your API key from: https://makersuite.google.com/app/apikey
    echo.
    pause
)

echo Starting development server...
echo Server will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

npm run dev
