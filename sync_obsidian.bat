@echo off
cd /d "D:\cofreobsidiannotepaula"

:: Se houver lock ativo no git, aborta para nao gerar conflito
if exist ".git\index.lock" exit /b 0

git pull origin main --quiet
git add .
git diff-index --quiet HEAD || git commit -m "Auto-sync %date% %time%" --quiet
git push origin main --quiet
