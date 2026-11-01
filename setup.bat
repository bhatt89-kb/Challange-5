@echo off
echo ========================================
echo GenAI Event Planner - Setup Script
echo ========================================
echo.

echo Step 1: Cleaning previous installation...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del /q package-lock.json
echo Done!
echo.

echo Step 2: Installing dependencies...
echo This may take a few minutes...
call npm install
if errorlevel 1 (
    echo.
    echo ERROR: Installation failed!
    echo Please check your internet connection and try again.
    pause
    exit /b 1
)
echo Done!
echo.

echo Step 3: Checking environment file...
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo.
    echo IMPORTANT: Please edit .env and add your GEMINI_API_KEY!
    echo Get your API key from: https://makersuite.google.com/app/apikey
    echo.
) else (
    echo .env file already exists.
)
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Edit .env file and add your GEMINI_API_KEY
echo 2. Run: npm run dev
echo 3. Open http://localhost:3000 in your browser
echo.
echo To verify everything works, run: npm run ci
echo.
pause
