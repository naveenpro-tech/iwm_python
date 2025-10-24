#!/bin/bash

# IWM Backend Server Start Script
# This script activates the virtual environment and starts the FastAPI backend server

set -e

echo "🚀 Starting IWM Backend Server..."
echo ""

# Check if virtual environment exists
if [ -d "apps/backend/venv" ]; then
    VENV_PATH="apps/backend/venv"
elif [ -d "apps/backend/.venv" ]; then
    VENV_PATH="apps/backend/.venv"
elif [ -d ".venv" ]; then
    VENV_PATH=".venv"
else
    echo "❌ Error: Virtual environment not found!"
    echo "   Expected locations:"
    echo "   - apps/backend/venv"
    echo "   - apps/backend/.venv"
    echo "   - .venv"
    echo ""
    echo "   Please run: cd apps/backend && python -m venv venv"
    exit 1
fi

echo "✓ Found virtual environment at: $VENV_PATH"

# Activate virtual environment
echo "✓ Activating virtual environment..."
source "$VENV_PATH/bin/activate"

# Check if hypercorn is installed
if ! command -v hypercorn &> /dev/null; then
    echo "❌ Error: Hypercorn not found in virtual environment!"
    echo "   Please run: pip install -r apps/backend/requirements.txt"
    exit 1
fi

echo "✓ Starting FastAPI backend server..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🌐 Server running at: http://localhost:8000"
echo "  📚 API docs available at: http://localhost:8000/docs"
echo "  📖 ReDoc available at: http://localhost:8000/redoc"
echo "  🔧 OpenAPI schema: http://localhost:8000/openapi.json"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the server
hypercorn apps.backend.src.main:app --bind 0.0.0.0:8000 --worker-class asyncio --h2

