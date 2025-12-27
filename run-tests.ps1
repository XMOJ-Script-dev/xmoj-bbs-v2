# Kill any existing vitest processes
Get-Process | Where-Object { $_.ProcessName -eq 'node' } | Where-Object { $_.CommandLine -like '*vitest*' } | Stop-Process -Force -ErrorAction SilentlyContinue

# Run tests
& npx vitest run --reporter=verbose
