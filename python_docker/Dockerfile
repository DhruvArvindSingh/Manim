FROM ubuntu:22.04

# Set non-interactive installation to avoid timezone prompt
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    curl \
    git 

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && node --version \
    && npm --version

WORKDIR /app


COPY __pycache__ __pycache__
COPY utils utils
COPY kafka kafka
COPY kafka_auth kafka_auth
COPY manim_env manim_env
COPY package*.json .
COPY getLLMres.js getLLMres.js
COPY runPythonCode.js runPythonCode.js
COPY index.js index.js
COPY S3 S3
COPY .env .env
COPY main.sh main.sh

RUN npm install
RUN chmod +x main.sh
# Only chmod script.js if it exists
# RUN chmod +x script.js

ENTRYPOINT ["/app/main.sh"]
