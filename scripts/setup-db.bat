@echo off
REM Setup PostgreSQL and Prisma for Windows

echo 🗄️  Setting up PostgreSQL and Prisma...
echo.

REM Check if PostgreSQL is installed
where psql >nul 2>nul
if errorlevel 1 (
    echo ❌ PostgreSQL is not installed.
    echo Please download and install from: https://www.postgresql.org/download/windows/
    pause
    exit /b 1
)

echo ✅ PostgreSQL found
echo.

REM Create the database
echo Creating database: property_marketplace
psql -U postgres -c "CREATE DATABASE property_marketplace;" 2>nul

if errorlevel 0 (
    echo ✅ Database created successfully!
) else (
    echo ℹ️  Database might already exist
)

echo.
echo 📝 Update your .env.local with:
echo    DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/property_marketplace?schema=public"
echo.
echo 🚀 To run migrations:
echo    npm run db:push
echo    npm run db:seed (optional)
echo.
pause
