#!/bin/bash

# Script to start ChromaDB server locally
echo "🚀 Starting ChromaDB server..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required to run ChromaDB server"
    echo "Please install Python 3 and try again"
    exit 1
fi

# Check if chromadb Python package is installed
if ! python3 -c "import chromadb" &> /dev/null; then
    echo "📦 Installing ChromaDB Python package..."
    pip3 install chromadb
fi

# Create data directory if it doesn't exist
mkdir -p ./chromadb-data

echo "📁 Data directory: ./chromadb-data"
echo "🌐 Server will run at: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop the server"
echo "="echo "🌐 Server will run at: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=========================================="

# Start ChromaDB server with persistent storage
python3 -m chromadb run --path ./chromadb-data --host localhost --port 8000