@echo off
cd /d "%~dp0"
git add .
for /f "tokens=1-3 delims=/" %%a in ('date /t') do set SYNC_DATE=%%a-%%b-%%c
for %%f in ('time /t') do set SYNC_TIME=%%f
git commit -m "Auto-sync %date% %time%" 2>nul
git push origin main 2>nul
