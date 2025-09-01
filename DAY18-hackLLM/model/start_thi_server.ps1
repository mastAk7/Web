# THI Pipeline Server Startup Script for PowerShell
# Run this script as Administrator if you encounter permission issues

Write-Host "Starting THI Pipeline Server..." -ForegroundColor Green
Write-Host ""

# Check if virtual environment exists
if (-not (Test-Path "thi_env")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv thi_env
    Write-Host "Virtual environment created." -ForegroundColor Green
    Write-Host ""
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& "thi_env\Scripts\Activate.ps1"

# Install requirements if needed
Write-Host "Installing/updating requirements..." -ForegroundColor Yellow
pip install -r requirements.txt

# Install spaCy model if needed
Write-Host "Checking spaCy model..." -ForegroundColor Yellow
try {
    python -c "import spacy; spacy.load('en_core_web_sm')" 2>$null
    Write-Host "spaCy model already installed." -ForegroundColor Green
} catch {
    Write-Host "Installing spaCy English model..." -ForegroundColor Yellow
    python -m spacy download en_core_web_sm
}

Write-Host ""
Write-Host "Starting THI server..." -ForegroundColor Green
Write-Host "Server will be available at: http://localhost:8000" -ForegroundColor Cyan
Write-Host "API docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start the server
python thi_server.py

Write-Host ""
Write-Host "Server stopped. Press any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
