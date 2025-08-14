FROM python:3.10-slim

# Set non-interactive installation
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies required for Manim and Node.js
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    git \
    ffmpeg \
    libcairo2 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    pkg-config \
    build-essential \
    libffi-dev \
    libcairo2-dev \
    libpango1.0-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get update \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && node --version \
    && npm --version

WORKDIR /app

# Install Manim directly (no need for venv in container)
RUN pip install --upgrade pip && \
    pip install manim

# Copy application files
COPY __pycache__ __pycache__
COPY cloudfront_auth cloudfront_auth
COPY kafka kafka
COPY kafka_auth kafka_auth
COPY S3 S3
COPY utils utils
COPY .env .env
COPY index.js index.js
COPY package*.json .
COPY main.sh main.sh
COPY verify_manim.py verify_manim.py
COPY test_manim.py test_manim.py
# Create a virtual environment for Manim
RUN python -m venv manim_env && \
    manim_env/bin/pip install --upgrade pip && \
    manim_env/bin/pip install manim

RUN npm install
RUN chmod +x main.sh
RUN chmod +x index.js

ENTRYPOINT ["/app/main.sh"]
