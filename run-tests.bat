@echo off
REM Fix Playwright browsers path issue
set PLAYWRIGHT_BROWSERS_PATH=

echo ================================
echo   Swag Labs Automated Testing  
echo ================================
echo.

:menu
echo Select an option:
echo 1. Run all tests
echo 2. Run all tests (headed mode - see browser)
echo 3. Run login tests only
echo 4. Run products tests only
echo 5. Run cart tests only
echo 6. Run checkout tests only
echo 7. Run E2E tests only
echo 8. Open test report
echo 9. Run tests in UI mode
echo 0. Exit
echo.

set /p choice="Enter your choice (0-9): "

if "%choice%"=="1" (
    echo Running all tests...
    call npx playwright test --workers=1
    goto end
)
if "%choice%"=="2" (
    echo Running all tests in headed mode...
    call npx playwright test --headed --workers=1
    goto end
)
if "%choice%"=="3" (
    echo Running login tests...
    call npx playwright test login.spec.js --workers=1
    goto end
)
if "%choice%"=="4" (
    echo Running products tests...
    call npx playwright test products.spec.js --workers=1
    goto end
)
if "%choice%"=="5" (
    echo Running cart tests...
    call npx playwright test cart.spec.js --workers=1
    goto end
)
if "%choice%"=="6" (
    echo Running checkout tests...
    call npx playwright test checkout.spec.js --workers=1
    goto end
)
if "%choice%"=="7" (
    echo Running E2E tests...
    call npx playwright test e2e-complete-flow.spec.js --workers=1
    goto end
)
if "%choice%"=="8" (
    echo Opening test report...
    call npx playwright show-report
    goto end
)
if "%choice%"=="9" (
    echo Opening UI mode...
    call npx playwright test --ui
    goto end
)
if "%choice%"=="0" (
    echo Exiting...
    exit /b
)

echo Invalid choice! Please try again.
echo.
goto menu

:end
echo.
echo Tests completed!
pause
