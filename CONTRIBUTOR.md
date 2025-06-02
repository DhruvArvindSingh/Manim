# Animath - Contributor Guide

Welcome to the **Animath** project! This guide will help you get started with contributing to our AI-powered mathematical animation platform.

## 🌟 Project Overview

Animath is a full-stack application that generates mathematical animations using AI and the Manim library. The platform consists of:

- **Frontend**: Next.js application with React and TypeScript
- **Socket Server**: Real-time communication using Socket.IO and Kafka
- **Python Backend**: Manim animation generation in Docker containers
- **Infrastructure**: AWS services for deployment and media storage

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Socket Server │    │  Python Docker  │
│   (Next.js)     │◄──►│   (Socket.IO)   │◄──►│    (Manim)      │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       │
         │              ┌─────────────────┐              │
         │              │     Kafka       │              │
         │              │   (Messaging)   │              │
         │              └─────────────────┘              │
         │                                                │
         ▼                                                ▼
┌─────────────────┐                            ┌─────────────────┐
│   AWS Services  │                            │   File System   │
│ (CloudFront/S3) │                            │   (Videos/Code) │
└─────────────────┘                            └─────────────────┘
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** (package manager)
- **Docker** and Docker Compose
- **Python 3.10+** (for local development)
- **Git**

### Development Setup

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd Animath
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Configuration**
   ```bash
   # Copy environment files
   cp frontend/.env.example frontend/.env.local
   cp socket-server/.env.example socket-server/.env
   cp python_docker/.env.example python_docker/.env
   ```

4. **Start Development Services**
   ```bash
   # Start all services
   pnpm dev
   
   # Or start individually
   cd frontend && pnpm dev
   cd socket-server && pnpm dev
   cd python_docker && docker-compose up
   ```

## 📁 Project Structure

```
Animath/
├── frontend/                 # Next.js frontend application
│   ├── components/          # React components
│   ├── app/                # App router pages
│   ├── hooks/              # Custom React hooks
│   └── lib/                # Utility functions
├── socket-server/           # Socket.IO server
│   ├── src/                # TypeScript source
│   └── kafka/              # Kafka integration
├── python_docker/          # Python/Manim backend
│   ├── utils/              # Utility functions
│   ├── kafka/              # Kafka producers
│   └── Dockerfile          # Container configuration
├── package.json            # Root package configuration
├── pnpm-workspace.yaml     # Workspace configuration
└── turbo.json             # Turborepo configuration
```

## 🛠️ Development Workflow

### Frontend Development

**Tech Stack**: Next.js 14, React, TypeScript, Tailwind CSS

**Key Components**:
- `MainInterface`: Main application interface
- `CodeDisplay`: Python code viewer with syntax highlighting
- `PromptInput`: User input component
- `Header`: Navigation and branding

**Development Commands**:
```bash
cd frontend
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm lint         # Run ESLint
pnpm type-check   # TypeScript checking
```

**UI Guidelines**:
- Use Tailwind CSS for styling
- Follow responsive design principles
- Implement dark mode support
- Use shadcn/ui components where possible

### Socket Server Development

**Tech Stack**: Node.js, Socket.IO, Kafka, TypeScript

**Key Features**:
- Real-time communication between frontend and backend
- Kafka message handling for LLM responses
- Room-based socket management

**Development Commands**:
```bash
cd socket-server
pnpm dev          # Start development server
pnpm build        # Build TypeScript
pnpm start        # Start production server
```

**Integration Points**:
- Listens to `llm-response` Kafka topic
- Emits `llm_response` and `project_status` socket events
- Manages user rooms for isolated sessions

### Python Backend Development

**Tech Stack**: Python, Manim, Docker, Kafka

**Key Components**:
- `runPythonCode.js`: Executes Manim animations
- `getPrompt.js`: LLM prompt generation
- Kafka producers for status updates

**Development Setup**:
```bash
cd python_docker
# Install Manim locally (optional)
python -m venv manim_env
source manim_env/bin/activate
pip install manim

# Or use Docker
docker build -t animath-python .
docker run -it animath-python
```

**Animation Pipeline**:
1. Receive user prompt via Kafka
2. Generate Python/Manim code using LLM
3. Execute code and render animation
4. Upload to S3/CloudFront
5. Send status updates via Kafka

## 🔧 Configuration

### Environment Variables

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3002
```

#### Socket Server (.env)
```env
SOCKET_SERVER_PORT=3002
KAFKA_BROKER_LIST=localhost:9092
KAFKA_USERNAME=your-username
KAFKA_PASSWORD=your-password
```

#### Python Docker (.env)
```env
KAFKA_BROKER_LIST=localhost:9092
KAFKA_USERNAME=your-username
KAFKA_PASSWORD=your-password
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

### Docker Configuration

The Python backend runs in Docker with:
- Python 3.10 slim base image
- Manim and dependencies
- Node.js for Kafka integration
- FFmpeg for video processing

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
pnpm test         # Run Jest tests
pnpm test:watch   # Watch mode
pnpm test:coverage # Coverage report
```

### Backend Testing
```bash
cd python_docker
python -m pytest tests/
```

### Integration Testing
```bash
# Test the full pipeline
pnpm test:integration
```

## 📋 Contributing Guidelines

### Code Standards

**TypeScript/JavaScript**:
- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for formatting
- Prefer functional components

**Python**:
- Follow PEP 8 style guide
- Use type hints where applicable
- Document functions with docstrings

**Git Workflow**:
1. Create feature branch from `main`
2. Make atomic commits with clear messages
3. Submit pull request with description
4. Address review feedback
5. Merge after approval

### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

**Types**: feat, fix, docs, style, refactor, test, chore

**Examples**:
```
feat(frontend): add horizontal scroll to code display
fix(backend): resolve source command not found error
docs(readme): update installation instructions
```

### Pull Request Process

1. **Create Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write clean, documented code
   - Add tests for new functionality
   - Update documentation as needed

3. **Test Locally**
   ```bash
   pnpm test
   pnpm build
   ```

4. **Submit PR**
   - Clear title and description
   - Link related issues
   - Add screenshots for UI changes

5. **Code Review**
   - Address reviewer feedback
   - Maintain conversation until approval

## 🐛 Debugging

### Common Issues

**Frontend**:
- Check browser console for errors
- Verify API endpoints are accessible
- Ensure socket connection is established

**Socket Server**:
- Check Kafka connection status
- Verify topic subscriptions
- Monitor socket event emissions

**Python Backend**:
- Check Docker container logs
- Verify Manim installation
- Test Python execution paths

### Debugging Tools

**Frontend**:
- React Developer Tools
- Redux DevTools (if applicable)
- Network tab for API calls

**Backend**:
- Docker logs: `docker logs container-name`
- Kafka monitoring tools
- Python debugger (pdb)

## 🚀 Deployment

### Development Deployment

```bash
# Build all services
pnpm build

# Deploy to staging
pnpm deploy:staging
```

### Production Deployment

```bash
# Build production images
docker build -t animath-frontend ./frontend
docker build -t animath-socket ./socket-server
docker build -t animath-python ./python_docker

# Deploy to AWS
# (specific deployment commands depend on infrastructure)
```

### AWS Services Used

- **CloudFront**: CDN for video delivery
- **S3**: Video and asset storage
- **ECS/Fargate**: Container orchestration
- **ALB**: Load balancing
- **MSK**: Managed Kafka service

## 📚 Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Manim Documentation](https://docs.manim.community/)
- [Socket.IO Documentation](https://socket.io/docs/)
- [Kafka Documentation](https://kafka.apache.org/documentation/)

### Learning Resources
- [Manim Tutorial](https://docs.manim.community/en/stable/tutorials/quickstart.html)
- [React Best Practices](https://react.dev/learn)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

## 🤝 Community

### Communication Channels
- **Issues**: GitHub Issues for bugs and feature requests
- **Discussions**: GitHub Discussions for questions and ideas
- **Email**: [contact@animath.com] for direct communication

### Contributing Areas

**Frontend**:
- UI/UX improvements
- Performance optimizations
- Accessibility enhancements
- Mobile responsiveness

**Backend**:
- Manim integration improvements
- Error handling enhancements
- Performance optimizations
- New animation features

**Infrastructure**:
- Docker optimizations
- CI/CD improvements
- Monitoring and logging
- Security enhancements

**Documentation**:
- User guides
- API documentation
- Tutorial creation
- Code examples

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- Special recognition for major features

## 📄 License

This project is licensed under [LICENSE]. By contributing, you agree to license your contributions under the same license.

---

**Thank you for contributing to Animath!** 🙏

Your contributions help make mathematical visualization more accessible to everyone. If you have questions, don't hesitate to reach out through our communication channels. 