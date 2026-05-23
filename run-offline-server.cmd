@echo off
cd /d "%~dp0"
"C:\Program Files\nodejs\node.exe" ".\scripts\serve-dist.mjs" --port=5176
pause
