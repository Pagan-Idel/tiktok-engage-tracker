@echo off

:: Check for admin rights
net session >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo This script requires administrator privileges.
    echo Attempting to restart with administrator rights...
    powershell -Command "Start-Process '%~0' -Verb runAs"
    exit /b
)

rem Change directory to the current folder the BAT file is located in
cd /d "%~dp0"

echo Checking for MySQL installation...

rem Check for MySQL installation directories
set MYSQL_INSTALLED=0
set MYSQL_PATH=""
for %%D in (
    "C:\Program Files\MySQL\MySQL Server 8.0\bin"
    "C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin"
) do (
    if exist %%D (
        echo MySQL installation found at: %%D
        set MYSQL_INSTALLED=1
        set MYSQL_PATH=%%D
        goto check_mysql_service
    )
)

rem If MySQL is not installed, exit with an error
if %MYSQL_INSTALLED% equ 0 (
    echo No MySQL installation found. Please install MySQL before running this script.
    pause
    exit /b
)

:check_mysql_service
echo Checking for MySQL service...

rem Check if the MySQL executable is in the PATH
where mysql >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo MySQL not found in PATH. Adding MySQL to PATH for this session...
    set "PATH=%MYSQL_PATH%;%PATH%"
    echo MySQL path added.
)

rem Only check the MySQL80 service, since we know it exists
echo Checking service: MySQL80
sc query MySQL80 | find "RUNNING" > nul
if %ERRORLEVEL% equ 0 (
    echo MySQL80 service is already running.
    goto found_mysql_service
)

echo Attempting to start: MySQL80
net start MySQL80
if %ERRORLEVEL% equ 2 (
    echo MySQL80 service is already running.
    goto found_mysql_service
)
if %ERRORLEVEL% equ 0 (
    echo Successfully started MySQL80 service.
    goto found_mysql_service
)

echo Failed to start MySQL80 service. Please start MySQL manually and try again.
pause
exit /b

:found_mysql_service
echo Using MySQL service: MySQL80.

rem Check if the MySQL database exists, using the root credentials from the credentials.json
mysql -h localhost -u root -proot -e "CREATE DATABASE IF NOT EXISTS tiktok_likes;" 2>nul
if %ERRORLEVEL% neq 0 (
    echo Failed to create the database. Exiting...
    pause
    exit /b
)

rem Execute the SQL script to create tables
mysql -h localhost -u root -proot tiktok_likes < "%~dp0database.sql"
if %ERRORLEVEL% neq 0 (
    echo Database creation or update failed. Exiting...
    pause
    exit /b
)

rem Check if npm install has been run by checking for node_modules directory
if not exist "node_modules" (
    echo Running npm install...
    npm install || echo npm install completed with warnings, continuing...
    exit
)

rem Check if the app has been built by checking for the .next folder (if using Next.js)
if not exist ".next" (
    echo Building the app...
    npm run build || echo npm run build failed or completed with warnings, continuing...
    exit
)

rem Run the service in production mode
start "" /b npm run start

rem Open Chrome at localhost:4000
start "" chrome http://localhost:4000

echo Setup complete. The app should now be running.

rem Wait for user input before closing
echo Press any key to exit...
pause
exit
