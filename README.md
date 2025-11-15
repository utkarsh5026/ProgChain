
# 🚀 AI-Powered Learning Platform

This project is a comprehensive full-stack learning platform I've built to help users explore programming concepts, prepare for interviews, and deepen their understanding of tech topics. It combines a modern React frontend with a Python FastAPI backend, leveraging AI to provide personalized learning experiences.

## 🧠 Core Features

- **Interactive Concept Exploration**: Users can ask questions about programming topics and follow a guided learning path that branches based on their interests.
- **Topic Learning Journeys**: The platform generates personalized learning paths for any programming concept, organized by difficulty level.
- **Learning Threads**: Create structured multi-part learning content organized as sequential threads with interactive Q&A.

## 🏗️ Architecture Overview

The application is split into two main components:
- A Python FastAPI backend that handles AI integration, file processing, and database operations
- A React/TypeScript frontend that provides an intuitive user interface

## 🐳 Running with Docker

I've set up Docker to make deployment and development easy. Here's how to get started:

### Prerequisites

- Docker and Docker Compose installed on your system
- A valid OpenAI API key for AI functionality

### Setting Up Environment Variables

Before running the containers, create a `.env` file in the server directory with:

```
OPENAI_API_KEY=your_openai_api_key_here
```

### Starting the Development Environment

For development with hot-reloading:

1. Navigate to the project root
2. Run `docker-compose -f docker-compose.dev.yml up`
3. The frontend will be available at http://localhost:3000
4. The backend will be available at http://localhost:8000

### Starting Production Environment

For production:

1. Navigate to the project root
2. Run `docker-compose up -d`
3. The application will be available at http://localhost:80

### Stopping the Containers

To stop the running containers:
- For development: Press Ctrl+C in the terminal or run `docker-compose -f docker-compose.dev.yml down`
- For production: Run `docker-compose down`

### Container Maintenance

- View logs: `docker-compose logs -f`
- Rebuild containers after changes to Dockerfile: `docker-compose build`
- Access container shell: `docker exec -it [container_name] bash`

## 💡 Troubleshooting

- If you encounter database issues, you may need to remove the volume: `docker-compose down -v`
- For permission issues with the project files directory, check folder permissions
- If the AI features aren't working, verify your OpenAI API key is correct and has sufficient credits

## 🔮 Future Plans

I'm planning to extend the platform with:

- More interactive learning tools like quizzes and exercises
- Collaborative features for team learning
- Progress tracking and learning analytics
- Support for more file types and learning resources
- Mobile-friendly UI improvements

This project combines my passion for education, AI, and software development to create a tool that I hope will help people learn more effectively. I'm excited to continue improving it and adding new features!