@echo off
cd /d "E:\CofreObsidian\Obsidian Vault"
git pull origin main
if %errorlevel% neq 0 (
    git pull
)
git add .
git commit -m "Auto-sync %date% %time%"
git push origin main
