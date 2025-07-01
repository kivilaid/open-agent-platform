# Open Agent Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Turborepo](https://img.shields.io/badge/Built%20with-Turborepo-EF4444.svg)](https://turborepo.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.3-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)

Open Agent Platform is a powerful, no-code platform for building, managing, and deploying AI agents powered by LangGraph. Create sophisticated conversational agents with RAG capabilities, tool integrations, and multi-agent orchestration - all through an intuitive web interface.

<video src="https://github.com/user-attachments/assets/bc91304b-e704-41d7-a0cd-9806d37640c0.mp4" controls="controls"></video>

## 🚀 Features

- **No-Code Agent Builder**: Create and configure LangGraph agents through an intuitive UI
- **Multi-Model Support**: Works with OpenAI, Anthropic, Google, and other LLM providers
- **RAG Integration**: First-class support for Retrieval Augmented Generation with [LangConnect](https://github.com/langchain-ai/langconnect)
- **Tool Ecosystem**: Connect agents to external tools via MCP (Model Context Protocol) servers
- **Agent Supervision**: Orchestrate multiple agents working together
- **Built-in Authentication**: Secure access control with Supabase authentication
- **Real-time Chat Interface**: Modern, responsive chat UI for agent interactions
- **Multi-Deployment Support**: Deploy to multiple LangGraph environments seamlessly

## 📋 Prerequisites

- Node.js v18+ and Yarn package manager
- Python 3.9+ (for running agents locally)
- Accounts with:
  - [Supabase](https://supabase.com) for authentication
  - LLM provider (OpenAI, Anthropic, or Google)
  - [LangSmith](https://smith.langchain.com) (optional, for tracing)

## 🛠️ Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/langchain-ai/open-agent-platform.git
cd open-agent-platform
yarn install
```

### 2. Configure Environment

Create `apps/web/.env.local`:

```bash
# API Configuration
NEXT_PUBLIC_BASE_API_URL="http://localhost:3000/api"

# Supabase Authentication (required)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# Agent Deployments (add your LangGraph deployments)
NEXT_PUBLIC_DEPLOYMENTS='[
  {
    "id": "deployment-1",
    "deploymentUrl": "https://your-deployment.api.langchain.com",
    "tenantId": "your-tenant-id",
    "name": "Production Agent",
    "isDefault": true,
    "defaultGraphId": "agent"
  }
]'
```

### 3. Run Development Server

```bash
yarn dev
```

Visit http://localhost:3000 to access the platform.

## 🏗️ Architecture

Open Agent Platform is built as a monorepo using Turborepo:

```
open-agent-platform/
├── apps/
│   ├── web/          # Next.js web application
│   └── docs/         # Documentation site
├── package.json      # Root package configuration
└── turbo.json       # Turborepo configuration
```

### Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **State Management**: Zustand
- **UI Components**: Radix UI with shadcn/ui
- **Authentication**: Supabase Auth
- **Agent Framework**: LangGraph, LangChain
- **Deployment**: Vercel, Docker, Kubernetes

## 🚢 Deployment

### Docker Deployment

```bash
docker build -t open-agent-platform .
docker run -p 3000:3000 --env-file .env.production open-agent-platform
```

### Vercel Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/langchain-ai/open-agent-platform)

### Self-Hosted Deployment

See [deployment documentation](./docs/deployment.md) for detailed instructions on:
- Kubernetes deployment
- Docker Compose setup
- Coolify deployment
- Environment configuration

## 🔧 Configuration

### Agent Configuration

Agents are configured through the UI with support for:
- Model selection (GPT-4, Claude, Gemini, etc.)
- System prompts
- Temperature and other parameters
- Tool integrations
- RAG collections

### Environment Variables

See [`.env.example`](./apps/web/.env.example) for all available configuration options.

## 🧩 Creating Custom Agents

1. **Using Pre-built Agents**: 
   - [Tools Agent](https://github.com/langchain-ai/oap-langgraph-tools-agent)
   - [Supervisor Agent](https://github.com/langchain-ai/oap-agent-supervisor)

2. **Building Your Own**: See our [custom agents guide](https://docs.oap.langchain.com/custom-agents/overview)

## 📚 Documentation

- **[Full Documentation](https://docs.oap.langchain.com)**: Comprehensive guides and API references
- **[Quickstart Guide](https://docs.oap.langchain.com/quickstart)**: Get up and running quickly
- **[Custom Agents](https://docs.oap.langchain.com/custom-agents/overview)**: Build your own agents
- **[Deployment Guide](https://docs.oap.langchain.com/deployment)**: Production deployment instructions

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/langchain-ai/open-agent-platform/issues)
- **Discussions**: [Join the conversation](https://github.com/langchain-ai/open-agent-platform/discussions)
- **Discord**: [LangChain Discord](https://discord.gg/langchain)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with ❤️ by the LangChain team and contributors.

Special thanks to all the open-source projects that make this platform possible.