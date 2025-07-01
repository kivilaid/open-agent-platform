# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Open Agent Platform is a no-code agent building platform built with Next.js 15 and TypeScript. It allows users to create, manage, and interact with LangGraph agents through a modern web interface.

## Key Commands

```bash
# Development (from root)
yarn dev        # Start all apps in development mode
yarn build      # Build all apps for production
yarn lint       # Run ESLint across all apps
yarn lint:fix   # Fix ESLint issues
yarn format     # Format code with Prettier

# Web app specific (from apps/web/)
yarn dev        # Start Next.js development server
yarn build      # Build for production
yarn start      # Start production server
```

## Architecture Overview

### Monorepo Structure
- Uses Turborepo with Yarn workspaces
- Main web app in `apps/web/`
- Documentation site in `apps/docs/`

### Tech Stack
- **Framework**: Next.js 15.3.1 with App Router
- **Language**: TypeScript 5.7.2
- **UI**: Tailwind CSS + shadcn/ui components
- **State**: Zustand for client-side state
- **Auth**: Supabase authentication
- **API Integration**: LangGraph SDK, MCP SDK

### Code Organization

#### Feature-Based Architecture (`src/features/`)
Each feature module contains:
- `components/` - Feature-specific React components
- `hooks/` - Custom hooks for that feature
- `providers/` - Context providers
- `utils/` - Utility functions
- `types.ts` - TypeScript definitions

Main features:
- **agents**: Agent CRUD operations and configuration
- **chat**: Chat interface and conversation management
- **rag**: RAG (Retrieval-Augmented Generation) integration
- **tools**: MCP tools management
- **auth**: Authentication flows

#### API Routes (`src/app/api/`)
- `/auth/callback` - Supabase auth callback
- `/langgraph/proxy/[...path]` - Proxy to LangGraph deployments
- `/oap_mcp/` - MCP server proxy

### Key Patterns

#### Authentication
- Middleware-based protection in `src/middleware.ts`
- All routes protected except `/signin`, `/signup`, `/forgot-password`, `/reset-password`
- Returns 401 for API routes, redirects for pages

#### State Management
- Zustand stores for agent configurations (`use-config-store.tsx`)
- React Context for global state (agents, auth, MCP)
- Per-agent configuration with local storage persistence

#### API Client Pattern
- Centralized client creation in `lib/client.ts`
- Supports multiple LangGraph deployments
- Proxy architecture to protect API keys

#### Component Patterns
- Use shadcn/ui components from `components/ui/`
- Feature components follow composition pattern
- Dialogs for create/edit operations

### Environment Variables

Key variables to configure:
- `NEXT_PUBLIC_DEPLOYMENTS` - JSON array of available LangGraph deployments
- `NEXT_PUBLIC_BASE_API_URL` - API base URL
- `LANGSMITH_API_KEY` - For LangSmith integration
- `NEXT_PUBLIC_RAG_API_URL` - RAG server URL
- `NEXT_PUBLIC_MCP_SERVER_URL` - MCP server URL
- Supabase credentials for authentication

### Development Guidelines

1. **Adding New Features**: Follow the pattern in `src/features/` - create a new directory with components, hooks, and types
2. **API Routes**: Use the proxy pattern established in `/api/langgraph/proxy/`
3. **Type Safety**: Define types in feature-specific `types.ts` or global `src/types/`
4. **Hooks**: Use existing hooks from `src/hooks/` or create feature-specific ones
5. **Components**: Leverage UI components from `components/ui/` before creating new ones

### Working with Agents

Agents are the core entity:
- Type definition extends LangChain's Assistant type
- Full CRUD via `useAgents` hook
- Configuration managed by Zustand store
- Support for tools (MCP), RAG, and Supervisor configurations

### Multi-Deployment Support

Unlike typical apps, this supports multiple LangGraph deployments:
- Deployments configured via environment variable
- Dynamic routing based on agent's deployment ID
- Each deployment can have its own authentication

### Common Tasks

**Creating a new agent feature:**
1. Add types to `src/features/agents/types.ts`
2. Create components in `src/features/agents/components/`
3. Add hooks to `src/features/agents/hooks/`
4. Update the agent creation/edit dialogs

**Adding a new API endpoint:**
1. Create route in `src/app/api/`
2. Follow the proxy pattern if connecting to external services
3. Add proper error handling and authentication checks

**Working with UI components:**
1. Check `components/ui/` for existing components
2. Use shadcn/ui CLI to add new components: `npx shadcn@latest add [component]`
3. Follow existing patterns for styling with Tailwind CSS