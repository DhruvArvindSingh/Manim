FROM ubuntu:22.04

# Set non-interactive installation to avoid timezone prompt
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-numpy \
    python3-matplotlib \
    curl \
    git \
    gnupg \
    ca-certificates \
    lsb-release \
    ffmpeg \
    libcairo2-dev \
    pkg-config \
    python3-dev \
    libpango1.0-dev \
    texlive-latex-base \
    texlive-latex-extra \
    texlive-fonts-recommended \
    texlive-fonts-extra \
    texlive-xetex \
    meson \
    ninja-build \
    python3-pip-whl \
    python3-wheel \
    python3-setuptools

# Install Node.js 20.x directly
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && node --version \
    && npm --version

WORKDIR /app

# Install manim and its dependencies
RUN pip3 install --upgrade pip
RUN pip3 install pycairo
RUN pip3 install manim

COPY main.sh main.sh
COPY socket.js socket.js
# If you have a script.js file, uncomment the next line
# COPY script.js script.js
COPY utils utils
COPY redis redis
COPY package*.json .

RUN npm install
RUN chmod +x main.sh
# Only chmod script.js if it exists
# RUN chmod +x script.js

ENTRYPOINT ["/app/main.sh"]
