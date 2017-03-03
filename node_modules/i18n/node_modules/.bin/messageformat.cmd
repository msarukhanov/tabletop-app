@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\..\messageformat\bin\messageformat.js" %*
) ELSE (
  node  "%~dp0\..\messageformat\bin\messageformat.js" %*
)