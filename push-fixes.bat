@echo off
echo ========================================
echo Pushing CI Fixes to GitHub
echo ========================================
echo.

echo Step 1: Adding fixed files...
git add .eslintrc.json
git add src/app/layout.tsx
git add .github
git add FIX_CI.md
echo Done!
echo.

echo Step 2: Committing changes...
git commit -m "Fix CI: Update ESLint config, fix React imports, update workflow"
if errorlevel 1 (
    echo.
    echo Note: No changes to commit or commit failed.
    echo.
    pause
    exit /b 1
)
echo Done!
echo.

echo Step 3: Pushing to GitHub...
git push
if errorlevel 1 (
    echo.
    echo ERROR: Push failed!
    echo Please check your internet connection and GitHub credentials.
    echo.
    pause
    exit /b 1
)
echo Done!
echo.

echo ========================================
echo Success! Changes Pushed
echo ========================================
echo.
echo Now check your GitHub repository:
echo 1. Go to the Actions tab
echo 2. Watch the CI workflow run
echo 3. It should pass with green checkmarks!
echo.
pause
