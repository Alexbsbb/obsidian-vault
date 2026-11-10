@echo off
cd /d "%~dp0"

:: Se houver lock ativo no git, aborta para nao gerar conflito
if exist ".git\index.lock" exit /b 0

rem Se o pull falhar (conflito/rede), aborta sem commitar estado quebrado
git pull origin main --quiet
if errorlevel 1 exit /b 1

rem git add NAO aceita --quiet/-q (opcao inexistente)
git add .
if errorlevel 1 exit /b 1

rem Commit somente se houver mudancas staged
git diff-index --quiet HEAD
if errorlevel 1 git commit -q -m "Auto-sync %date% %time%"

git push origin main --quiet
exit /b %errorlevel%
