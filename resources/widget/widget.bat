@echo off

del "%~dp0widget.zip" 2>NUL

"C:\Program Files\7-Zip\7z.exe" a "%~dp0widget.zip" *.* -r -xr!*.bat