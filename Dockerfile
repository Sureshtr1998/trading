# Base image
FROM python:3.9-slim

# Install system dependencies
RUN apt-get update && apt-get install -y python3-pip

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r backend_stock_trading/requirements.txt

# Expose port 8000
EXPOSE 8000

# Default command to run the Django server
CMD ["python", "backend_stock_trading/manage.py", "runserver", "0.0.0.0:8000"]
