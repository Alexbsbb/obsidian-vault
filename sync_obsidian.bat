@echo off
cd /d "D:\cofreobsidiannotepaula"
git pull origin main
if %errorlevel% neq 0 (
    git pull
)
git add .
git diff-index --quiet HEAD || git commit -m "Auto-sync %date% %time%"
git push origin main
