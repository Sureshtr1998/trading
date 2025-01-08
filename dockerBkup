# Base image
FROM python:3.9-slim

# Install virtualenv
RUN apt-get update && apt-get install -y \
    python3-venv \
    python3-pip \
    && pip install virtualenv



# Set environment variables for virtualenv
ENV WORKON_HOME=/root/.virtualenvs
RUN mkdir -p $WORKON_HOME

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Create the virtual environment
RUN python3 -m venv /app/stocks_env

# Create the `stocks` environment
RUN /bin/bash -c "source /app/stocks_env/bin/activate && pip install -r backend_stock_trading/requirements.txt"
