# ProgChain Features Documentation

## Overview
ProgChain is an AI-powered learning platform that helps developers learn programming concepts, prepare for technical interviews, and manage coding projects. It combines multiple learning modes with AI assistance to create personalized learning experiences.

---

## 🎯 Core Features

### 1. **Topic Explorer** - Interactive Learning Paths

**What it does**: Generates hierarchical learning paths for any programming topic with difficulty-based progression.

**Key Features**:
- **Hierarchical Topic Trees**: Topics are organized in chains (e.g., Python → Async Programming → Asyncio)
- **Difficulty Levels**: Each subtopic is categorized as Easy, Medium, or Hard
- **AI-Generated Content**: Uses OpenAI to generate relevant subtopics and descriptions
- **Visual Learning Path**: Frontend displays topics in an interactive flowchart/tree structure
- **Topic Chains**: Persistent learning paths that can be saved and resumed

**API Endpoints**:
- `POST /topics/generate` - Generate subtopics for a given topic path
- `POST /topics/create-topic-chain` - Create a new topic learning chain

**Database Models**:
- `TopicChain`: Represents a complete learning journey
- `BaseTopic`: Main topic in the chain
- `SubTopic`: Specific concepts with difficulty ratings

**Example Use Case**:
```
User asks: "Python"
→ System generates: Beginner (Variables, Functions), Intermediate (Classes, Decorators), Advanced (Metaclasses, Async)
→ User selects: "Async Programming"
→ System generates deeper subtopics for async programming
```

**Frontend Component**: `client/src/components/topics/TopicChain.tsx`

---

### 2. **Interview Preparation** - Technical Interview Questions

**What it does**: Generates AI-powered interview questions for specific technologies and topics.

**Key Features**:
- **Topic-Based Questions**: Generate questions for any tech stack
- **Contextual Understanding**: Provide additional context for more targeted questions
- **Streaming Responses**: Real-time question generation
- **Question Quality**: AI ensures questions are relevant and appropriately challenging

**API Endpoints**:
- `POST /interview/questions` - Generate interview questions with streaming

**Request Example**:
```json
{
  "topic": "React Hooks",
  "context": "Senior frontend developer position"
}
```

**Response Format**:
```json
{
  "topic": "React Hooks",
  "questions": [
    {
      "question": "Explain the difference between useEffect and useLayoutEffect",
      "difficulty": "intermediate"
    }
  ]
}
```

**Frontend Component**: `client/src/components/interview/Interview.tsx`

---

### 3. **Explore Mode** - Conversational Learning Assistant

**What it does**: Interactive Q&A system where users can explore any programming topic through conversation.

**Key Features**:
- **Research Assistant**: AI acts as a programming tutor
- **Chat History**: Maintains conversation context across sessions
- **Follow-up Questions**: Ask clarifying questions on any topic
- **Multi-Model Support**: Choose between different OpenAI models (GPT-4, GPT-3.5)
- **Vector Store Integration**: Uses FAISS for semantic search and context retrieval
- **Conversation Management**: Save, list, and delete exploration sessions

**API Endpoints**:
- `POST /explore/topic` - Start exploring a new topic
- `POST /explore/question` - Ask a follow-up question in an existing chat
- `POST /explore/chats/list` - Get all saved exploration chats
- `GET /explore/chat/{chat_id}` - Retrieve a specific chat session
- `DELETE /explore/chat/{chat_id}` - Delete a chat session

**Database Models**:
- Chat sessions with full conversation history
- Message storage with timestamps

**Frontend Component**: `client/src/components/explore/Explore.tsx`

**Example Flow**:
```
User: "Explain how Python decorators work"
→ AI provides detailed explanation
User: "Can you show me a practical example?"
→ AI provides code examples
User: "How do I create a decorator with arguments?"
→ AI provides advanced examples
```

---

### 4. **Learning Threads** - Structured Content Generation

**What it does**: Creates multi-part learning content organized as threads with individual content pieces.

**Key Features**:
- **Thread Creation**: Generate complete learning paths on any topic
- **Content Organization**: Each thread contains multiple content pieces
- **Progressive Learning**: Content is organized sequentially
- **Interactive Chat**: Ask questions about specific content pieces
- **Content Expansion**: Generate additional content for existing threads

**API Endpoints**:
- `POST /threads/create` - Create a new thread and generate initial content
- `POST /threads/generate` - Generate more content for an existing thread
- `GET /threads/` - List all threads
- `GET /threads/{thread_id}` - Get all content for a specific thread
- `POST /threads/chat` - Chat about specific thread content
- `GET /threads/chat/{thread_content_id}` - Get chat history for content
- `POST /threads/chat/stop` - Stop ongoing chat generation

**Database Models**:
- `Thread`: Main learning topic container
- `ThreadContent`: Individual learning content pieces
- `ThreadContentChat`: Q&A sessions about specific content

**Frontend Component**: `client/src/components/thread/Thread.tsx`

**Example Use Case**:
```
User creates thread: "Advanced React Patterns"
→ System generates content:
  1. Render Props Pattern
  2. Higher-Order Components
  3. Custom Hooks Pattern
  4. Compound Components
→ User clicks on "Custom Hooks Pattern"
→ User asks: "When should I use custom hooks vs regular functions?"
→ AI provides contextual explanation
```

---

### 5. **Project Management** - File-Based Knowledge System

**What it does**: Manage coding projects with file uploads and AI-powered project understanding.

**Key Features**:
- **Project Creation**: Create and organize multiple projects
- **File Upload**: Upload project files (code, docs, etc.)
- **Vector Database**: Each project has its own vector store for semantic search
- **Project Chat**: Ask questions about your project files
- **File Context**: AI answers are grounded in your actual project files
- **Chat History**: Maintains conversation history per project

**API Endpoints**:
- `POST /projects/create` - Create a new project
- `POST /projects/upload-file` - Upload files to a project

**Database Models**:
- `Project`: Project metadata (title, description, vector DB path)
- `ProjectFiles`: Uploaded files with paths
- `ProjectChats`: Chat sessions for each project
- `ProjectChatMessages`: Individual messages with file context

**Frontend Component**: `client/src/components/projects/Projects.tsx`

**Example Workflow**:
```
1. Create project: "E-commerce API"
2. Upload files: server.js, routes.js, models.js
3. System indexes files in vector database
4. User asks: "How is authentication handled?"
5. AI searches through files and provides answer based on actual code
```

---

### 6. **Infinity Mode** - Extensible Learning Modes (Beta)

**What it does**: Provides a registry system for different learning modes and content generation.

**Key Features**:
- **Mode Registry**: Pluggable system for different learning experiences
- **Topic Generation**: Mass generate learning topics
- **Categorization**: Organize topics by categories
- **Extensible Architecture**: Easy to add new learning modes

**API Endpoints**:
- `POST /infinity/topics/generate` - Generate multiple topic titles

**Frontend Integration**: Can be extended for new learning modes

---

### 7. **LeetCode Problem Scraper** (Utility)

**What it does**: Scrapes LeetCode problems for offline practice and learning.

**Key Features**:
- **Selenium-Based Scraping**: Automated browser scraping
- **Problem Details**: Extracts descriptions, tags, examples
- **Multi-Processing**: Parallel scraping for efficiency
- **JSON Export**: Saves problems in structured format
- **Retry Logic**: Handles failures gracefully

**Files**: `server/src/scrape/problem_scrape.py`

**Use Case**: Build a local database of coding problems for practice

---

## 🎨 Frontend Features

### UI Components

**Modern Design System**:
- Dark mode by default
- Radix UI components (accessible, customizable)
- Tailwind CSS for styling
- Framer Motion for animations
- Responsive layouts

**Key UI Features**:
1. **Sidebar Navigation**: Quick access to all features
2. **Streaming Responses**: Real-time AI response display
3. **Markdown Rendering**: Rich text formatting with code highlighting
4. **Math Rendering**: LaTeX support via KaTeX
5. **Code Syntax Highlighting**: Beautiful code blocks
6. **Interactive Flows**: Visual node-based topic exploration
7. **Loading Animations**: Custom AI thinking animations
8. **Toast Notifications**: User feedback system

### Frontend Routes

```
/                  → Explore Mode (default)
/explore           → Conversational Learning
/topics            → Topic Explorer
/interview         → Interview Prep
/threads           → Learning Threads
/projects          → Project Management
/history           → Chat History
```

---

## 🔧 Technical Architecture

### Backend Stack

**Framework**: FastAPI (Python 3.11+)
- Async/await throughout
- Type hints with Pydantic
- Automatic API documentation (Swagger/OpenAPI)
- Server-Sent Events (SSE) for streaming

**AI Integration**:
- **OpenAI API**: GPT-4, GPT-3.5 for content generation
- **LangChain**: Orchestration framework
- **LangGraph**: Advanced AI workflows
- **FAISS**: Vector similarity search

**Database**:
- **SQLite** with async support (aiosqlite)
- SQLAlchemy ORM (async)
- Database models with mixins (timestamps, public IDs)

**File Processing**:
- **PyMuPDF**: PDF reading
- **python-docx**: Word document processing
- Multiple PDF libraries (pypdf, PyPDF2, pdfminer)

### Frontend Stack

**Framework**: React 18 + TypeScript
- Vite for build tooling
- React Router for navigation
- Redux Toolkit for state management

**UI Libraries**:
- Radix UI primitives
- Tailwind CSS
- shadcn/ui components
- Framer Motion animations
- Lucide React icons

**Rendering**:
- React Markdown for content
- Syntax highlighting
- Math rendering (KaTeX)
- PDF viewing

---

## 🌟 Unique Selling Points

### 1. **Multi-Modal Learning**
Unlike single-purpose learning platforms, ProgChain offers:
- Topic exploration (structured)
- Conversational learning (flexible)
- Interview prep (practical)
- Project-based learning (contextual)
- Thread-based learning (sequential)

### 2. **AI-Powered Personalization**
- Content adapts to user's learning path
- Difficulty levels automatically adjusted
- Context-aware responses
- Follow-up question support

### 3. **Real-Time Streaming**
- No waiting for complete responses
- Progressive content loading
- Better user experience
- Efficient resource usage

### 4. **Project Context Awareness**
- Upload your actual code
- Get answers based on YOUR project
- No generic responses
- Learn from your own codebase

### 5. **Comprehensive Coverage**
- Any programming language
- Any framework or technology
- Interview preparation
- Practical coding problems
- Theoretical concepts

---

## 📊 Feature Comparison

| Feature | ProgChain | Stack Overflow | LeetCode | Coursera |
|---------|-----------|----------------|----------|----------|
| AI-Powered Q&A | ✅ | ❌ | ❌ | ❌ |
| Topic Exploration | ✅ | ❌ | ❌ | ✅ |
| Interview Prep | ✅ | ❌ | ✅ | ❌ |
| Project Context | ✅ | ❌ | ❌ | ❌ |
| Streaming Responses | ✅ | ❌ | ❌ | ❌ |
| Personalized Paths | ✅ | ❌ | ❌ | ✅ |
| Free to Use | ✅* | ✅ | Partial | Partial |

*Requires OpenAI API key

---

## 🎓 Learning Workflows

### Beginner Workflow
```
1. Start with Explore Mode
   → Ask: "What is Python?"
   → Get foundational explanation

2. Use Topic Explorer
   → Generate learning path for Python
   → Follow beginner → intermediate → advanced

3. Practice with Interview Questions
   → Test understanding
   → Get immediate feedback
```

### Intermediate Workflow
```
1. Create Learning Thread
   → Topic: "Advanced JavaScript Patterns"
   → Get structured multi-part content

2. Deep Dive with Projects
   → Upload your code
   → Ask specific questions
   → Get contextual answers

3. Interview Preparation
   → Generate questions for target role
   → Practice explanations
```

### Advanced Workflow
```
1. Project-Based Learning
   → Upload entire codebase
   → Ask architecture questions
   → Get refactoring suggestions

2. Specialized Topics
   → Explore cutting-edge concepts
   → Generate custom learning paths
   → Deep technical discussions
```

---

## 🔮 Future Feature Possibilities

Based on the current architecture, here are potential features:

### Planned/In Development
1. **Infinity Mode Expansion** - More learning modes
2. **User Authentication** - Personal accounts
3. **Progress Tracking** - Learning analytics
4. **Code Execution** - Run code in browser
5. **Collaborative Learning** - Share with others

### Technical Enhancements
1. **PostgreSQL Migration** - Better scalability
2. **Redis Caching** - Faster responses
3. **Rate Limiting** - Fair usage
4. **Multi-Language Support** - i18n
5. **Mobile App** - React Native

### Learning Features
1. **Quiz Generation** - Test knowledge
2. **Code Challenges** - Practice problems
3. **Video Integration** - Multimedia learning
4. **Spaced Repetition** - Memory retention
5. **Peer Review** - Community feedback

---

## 💡 Use Cases

### 1. **Self-Taught Developers**
- Learn new languages systematically
- Get instant answers to questions
- Build structured knowledge

### 2. **Interview Preparation**
- Practice technical questions
- Understand concepts deeply
- Build confidence

### 3. **Professional Development**
- Learn new frameworks quickly
- Understand existing codebases
- Stay current with technology

### 4. **Students**
- Supplement coursework
- Get additional explanations
- Practice for exams

### 5. **Code Reviewers**
- Understand unfamiliar code
- Learn best practices
- Improve code quality

---

## 🎯 Getting Started

### Quick Start
1. **Explore Mode**: Ask any programming question
2. **Topic Explorer**: Enter a technology you want to learn
3. **Interview Prep**: Select your target role/technology
4. **Projects**: Upload code for contextual help
5. **Threads**: Generate structured learning content

### Best Practices
- Start broad, then go deep
- Use multiple learning modes
- Upload real projects for better context
- Save important conversations
- Follow difficulty progressions

---

## 📈 Feature Metrics

### Current Capabilities
- **5 Main Learning Modes**
- **15+ API Endpoints**
- **50+ Frontend Components**
- **Multiple AI Models Supported**
- **Unlimited Topics Coverage**
- **Real-time Streaming**
- **Vector Search Enabled**
- **Multi-Format File Support**

---

## 🔗 Feature Dependencies

```
Core Infrastructure:
├── FastAPI (Backend)
├── React (Frontend)
├── OpenAI API (AI)
└── SQLite (Database)

Learning Features:
├── Topic Explorer
│   ├── AI Generation
│   ├── Difficulty Rating
│   └── Visual Display
│
├── Explore Mode
│   ├── Conversation AI
│   ├── Vector Search
│   └── Chat History
│
├── Interview Prep
│   ├── Question Generation
│   └── Streaming Responses
│
├── Threads
│   ├── Content Generation
│   ├── Thread Management
│   └── Interactive Chat
│
└── Projects
    ├── File Upload
    ├── Vector Indexing
    └── Context-Aware AI
```

---

## 📝 Summary

ProgChain is a comprehensive AI-powered learning platform that combines:
- **Structured learning** (Topic Explorer, Threads)
- **Conversational learning** (Explore Mode)
- **Practical application** (Interview Prep, Projects)
- **Modern technology** (Real-time streaming, Vector search)
- **Flexible architecture** (Extensible, modular)

It's designed to help developers at all levels learn more effectively by providing multiple learning modes, AI assistance, and personalized experiences.
