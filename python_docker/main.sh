#! /bin/bash

# This line is redundant and unnecessary.
# It's attempting to export an environment variable GIT_REPOSITORY__URL 
# by setting it equal to itself, which doesn't accomplish anything since
# the variable would already be available in the environment

echo "PORT: $PORT" 
echo "GEMINI_API_KEY: $GEMINI_API_KEY"
exec node index.js