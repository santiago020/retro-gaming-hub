@echo off
chcp 65001 >nul
title Subir RetroStation Hub a GitHub (santiago020)

echo ========================================================
echo    SUBIR RETROSTATION HUB A TU CUENTA DE GITHUB
echo ========================================================
echo.
echo Tu usuario detectado es: santiago020
echo.
echo PASO 1: Asegúrate de haber creado el repositorio en GitHub:
echo         https://github.com/new
echo         Nombre recomendado del repositorio: retro-gaming-hub
echo.
echo Presiona cualquier tecla cuando hayas creado el repositorio en GitHub...
pause >nul

echo.
echo PASO 2: Conectando y subiendo los archivos a tu GitHub...
echo.

cd /d "%~dp0"
git remote remove origin 2>nul
git remote add origin https://github.com/santiago020/retro-gaming-hub.git
git branch -M main

echo Ejecutando git push a: https://github.com/santiago020/retro-gaming-hub.git
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo  ¡LISTO! Tu proyecto se ha subido con éxito a:
    echo  https://github.com/santiago020/retro-gaming-hub
    echo ========================================================
) else (
    echo.
    echo --------------------------------------------------------
    echo Si te solicitó credenciales o token personal:
    echo Puedes generar un Token en: https://github.com/settings/tokens
    echo con permisos de 'repo' y pegarlo como tu contraseña.
    echo --------------------------------------------------------
)

echo.
pause
