#!/bin/bash

# Docker management script for Animath Python Service

case "$1" in
  build)
    echo "🔨 Building Docker image..."
    docker build -t animath-python-service .
    ;;
  start)
    echo "🚀 Starting container..."
    docker-compose up -d
    ;;
  stop)
    echo "🛑 Stopping container..."
    docker-compose down
    ;;
  restart)
    echo "🔄 Restarting container..."
    docker-compose down
    docker-compose up -d
    ;;
  logs)
    echo "📋 Showing container logs..."
    docker logs -f animath-python-service
    ;;
  status)
    echo "📊 Container status:"
    docker ps --filter name=animath-python-service
    ;;
  shell)
    echo "🐚 Accessing container shell..."
    docker exec -it animath-python-service /bin/bash
    ;;
  clean)
    echo "🧹 Cleaning up containers and images..."
    docker-compose down
    docker rmi animath-python-service 2>/dev/null || true
    ;;
  *)
    echo "🐳 Animath Python Service Docker Manager"
    echo ""
    echo "Usage: $0 {build|start|stop|restart|logs|status|shell|clean}"
    echo ""
    echo "Commands:"
    echo "  build    - Build the Docker image"
    echo "  start    - Start the container"
    echo "  stop     - Stop the container"
    echo "  restart  - Restart the container"
    echo "  logs     - Show container logs (follow mode)"
    echo "  status   - Show container status"
    echo "  shell    - Access container shell"
    echo "  clean    - Remove container and image"
    echo ""
    echo "Current status:"
    docker ps --filter name=animath-python-service --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    ;;
esac