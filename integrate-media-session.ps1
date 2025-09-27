 = Get-Content 'script.js' -Raw
 = Get-Content 'media-session-code.js' -Raw
 = '// Audio controls - now handled by Mixcloud widget' + [Environment]::NewLine + [Environment]::NewLine + 
 =  -replace '// Audio controls - now handled by Mixcloud widget', 
Set-Content 'script.js' -Value  -Encoding UTF8
