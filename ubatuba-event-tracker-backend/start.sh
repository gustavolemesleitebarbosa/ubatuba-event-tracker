#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

echo "Running database migrations..."
python3.11 migrations.py

echo "Starting FastAPI server..."
uvicorn app.main:app --host 0.0.0.0 --port 8000

