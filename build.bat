@echo off
REM This script builds and runs the Docker Compose file based on the given argument: "prod" or "dev"

if "%~1"=="" (
    echo No build mode specified.
    echo Usage: %0 [prod^|dev]
    pause
    exit /b 1
)

set MODE=%~1

if /I "%MODE%"=="dev" (
    if not exist compose.dev.yml (
        echo Error: compose.dev.yml file not found!
        pause
        exit /b 1
    )
    echo Running Development Build...
    docker compose -f compose.dev.yml up --build
) else if /I "%MODE%"=="prod" (
    if not exist compose.yml (
        echo Error: compose.yml file not found!
        pause
        exit /b 1
    )
    echo Running Production Build...
    docker compose -f compose.yml up --build
) else (
    echo Invalid build mode: %MODE%
    echo Usage: %0 [prod^|dev]
    pause
    exit /b 1
)
pause