@echo off
echo Cleaning up node_modules...
rmdir /s /q node_modules
del package-lock.json

echo Installing dependencies (Tailwind v3)...
call npm install

echo Installation complete.
echo Please run 'npm run dev' to start the server.
pause
