# Base image
FROM python:3.13-slim

# Create app directory
WORKDIR /app

# Copy project files
COPY . /app
# Copy keys folder
COPY keys /app/keys
# Install dependencies
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Expose port
# EXPOSE 8088

# Start app
CMD ["python", "app.py"]


