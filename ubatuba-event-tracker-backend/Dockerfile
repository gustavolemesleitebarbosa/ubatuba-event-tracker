# Use a lightweight Python image
FROM python:3.11-slim

# Set working directory inside the container
WORKDIR /app

# Copy dependency file and install dependencies
COPY ubatuba-event-tracker-backend/requirements.txt .
RUN pip install --no-cache-dir --progress-bar off -r requirements.txt

# Copy the rest of the backend code (including app/, migrations.py, start.sh)
COPY ubatuba-event-tracker-backend/ .

# Ensure the startup script is executable inside the container
RUN chmod +x /app/start.sh

# Expose the FastAPI default port
EXPOSE 8000

# Use ENTRYPOINT to ensure the shell script is executed correctly
ENTRYPOINT ["/bin/bash", "./start.sh"]
