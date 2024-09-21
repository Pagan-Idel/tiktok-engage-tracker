@echo off

rem Change directory to the current folder the BAT file is located in
cd /d "%~dp0"

echo Checking for MySQL installation...

rem Check for MySQL installation directories
set MYSQL_INSTALLED=0
for %%D in (
    "C:\Program Files\MySQL"
    "C:\Program Files (x86)\MySQL"
) do (
    if exist %%D (
        echo MySQL installation found at: %%D
        set MYSQL_INSTALLED=1
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

rem List of possible MySQL service names
set MYSQL_SERVICES=MySQL MySQL57 MySQL80 MySQL56 MySQL8

rem Loop through the possible service names to find the running one
set MYSQL_SERVICE_FOUND=0
for %%S in (%MYSQL_SERVICES%) do (
    sc query %%S | find "RUNNING" > nul
    if %ERRORLEVEL% equ 0 (
        set MYSQL_SERVICE_FOUND=1
        set MYSQL_SERVICE_NAME=%%S
        goto found_mysql_service
    )
)

rem If no MySQL service is running, attempt to start one
if %MYSQL_SERVICE_FOUND% equ 0 (
    echo No MySQL service is running. Attempting to start a MySQL service...
    for %%S in (%MYSQL_SERVICES%) do (
        sc query %%S | find "STOPPED" > nul
        if %ERRORLEVEL% equ 0 (
            net start %%S
            if %ERRORLEVEL% equ 0 (
                echo Successfully started MySQL service %%S.
                set MYSQL_SERVICE_NAME=%%S
                goto found_mysql_service
            )
        )
    )
    
    echo Failed to start any MySQL service. Please start MySQL manually and try again.
    exit /b
)

:found_mysql_service
echo Using MySQL service: %MYSQL_SERVICE_NAME%.

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

rem Check if the MySQL database exists, using the root credentials from the credentials.json
mysql -h localhost -u root -proot -e "USE tiktok_likes" 2>nul
if %ERRORLEVEL% neq 0 (
    echo Database not found, creating...
    mysql -h localhost -u root -proot < "%~dp0database.sql"
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
