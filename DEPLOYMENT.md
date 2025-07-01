# Open Agent Platform Deployment Guide

This guide covers various deployment options for Open Agent Platform.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Deployment Options](#deployment-options)
  - [Docker](#docker)
  - [Docker Compose](#docker-compose)
  - [Vercel](#vercel)
  - [Railway](#railway)
  - [Coolify](#coolify)
  - [Kubernetes](#kubernetes)
- [Production Considerations](#production-considerations)
- [Monitoring & Logging](#monitoring--logging)

## Prerequisites

Before deploying, ensure you have:

1. **Supabase Project**: Create at [supabase.com](https://supabase.com)
2. **LangGraph Deployment**: Deploy your agents to LangGraph Platform
3. **Environment Variables**: All required configuration values

## Environment Configuration

### Required Variables

```bash
# Authentication
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Agent Deployments
NEXT_PUBLIC_DEPLOYMENTS='[{...}]'  # JSON array of deployments
```

### Optional Variables

```bash
# API Configuration
NEXT_PUBLIC_BASE_API_URL=https://your-domain.com/api

# Features
NEXT_PUBLIC_RAG_API_URL=https://your-rag-server.com
NEXT_PUBLIC_MCP_SERVER_URL=https://your-mcp-server.com
```

## Deployment Options

### Docker

Build and run with Docker:

```bash
# Build image
docker build -t open-agent-platform .

# Run with environment file
docker run -p 3000:3000 --env-file .env.production open-agent-platform

# Or with inline variables
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=... \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
  -e NEXT_PUBLIC_DEPLOYMENTS='[...]' \
  open-agent-platform
```

### Docker Compose

#### Basic Setup

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### With Optional Services

```bash
# With PostgreSQL
docker-compose --profile with-db up -d

# With Redis cache
docker-compose --profile with-cache up -d

# With Nginx proxy
docker-compose --profile with-proxy up -d

# All services
docker-compose --profile with-db --profile with-cache --profile with-proxy up -d
```

### Vercel

1. Fork the repository
2. Import to Vercel: [vercel.com/import](https://vercel.com/import)
3. Configure environment variables in Vercel dashboard
4. Deploy

Or use the deploy button:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/langchain-ai/open-agent-platform)

### Railway

1. Fork the repository
2. Create new project on [railway.app](https://railway.app)
3. Deploy from GitHub
4. Add environment variables
5. Generate domain

```bash
# Railway CLI deployment
railway login
railway init
railway up
railway domain
```

### Coolify

Create `coolify.json` in your repository:

```json
{
  "version": "1.0",
  "services": {
    "web": {
      "build": {
        "type": "dockerfile",
        "dockerfile": "Dockerfile"
      },
      "ports": ["3000:3000"],
      "environment": {
        "NODE_ENV": "production"
      },
      "health_check": {
        "path": "/api/health",
        "interval": 30
      }
    }
  }
}
```

Then deploy via Coolify UI or API.

### Kubernetes

#### 1. Create ConfigMap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: oap-config
data:
  NEXT_PUBLIC_BASE_API_URL: "https://your-domain.com/api"
  NEXT_PUBLIC_GOOGLE_AUTH_DISABLED: "false"
```

#### 2. Create Secret

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: oap-secrets
type: Opaque
stringData:
  NEXT_PUBLIC_SUPABASE_URL: "https://your-project.supabase.co"
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "your-anon-key"
  NEXT_PUBLIC_DEPLOYMENTS: '[...]'
```

#### 3. Create Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: oap-web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: oap-web
  template:
    metadata:
      labels:
        app: oap-web
    spec:
      containers:
      - name: web
        image: your-registry/open-agent-platform:latest
        ports:
        - containerPort: 3000
        envFrom:
        - configMapRef:
            name: oap-config
        - secretRef:
            name: oap-secrets
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 10
```

#### 4. Create Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: oap-web-service
spec:
  selector:
    app: oap-web
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: LoadBalancer
```

#### 5. Deploy

```bash
kubectl apply -f k8s/
kubectl get pods
kubectl get services
```

## Production Considerations

### Security

1. **Environment Variables**
   - Never commit `.env` files
   - Use secrets management (Vault, AWS Secrets Manager, etc.)
   - Rotate API keys regularly

2. **Network Security**
   - Use HTTPS everywhere
   - Configure CORS properly
   - Set up rate limiting

3. **Authentication**
   - Enable Supabase RLS (Row Level Security)
   - Configure OAuth providers properly
   - Set up proper session management

### Performance

1. **Caching**
   - Enable Next.js caching
   - Use Redis for session storage
   - Configure CDN for static assets

2. **Scaling**
   - Horizontal scaling with multiple instances
   - Load balancing
   - Auto-scaling based on metrics

3. **Database**
   - Connection pooling
   - Query optimization
   - Regular backups

### High Availability

1. **Multiple Regions**
   ```yaml
   # Deploy to multiple regions
   regions:
     - us-east-1
     - eu-west-1
     - ap-southeast-1
   ```

2. **Health Checks**
   - Implement `/api/health` endpoint
   - Monitor all dependencies
   - Set up alerts

3. **Disaster Recovery**
   - Regular backups
   - Failover procedures
   - Recovery testing

## Monitoring & Logging

### Application Monitoring

1. **Metrics**
   - Response times
   - Error rates
   - Active users
   - Agent usage

2. **Logging**
   ```javascript
   // Structured logging
   logger.info('Agent created', {
     userId: user.id,
     agentId: agent.id,
     deployment: deployment.id
   });
   ```

3. **Tracing**
   - Enable LangSmith tracing
   - Distributed tracing with OpenTelemetry
   - Performance profiling

### Infrastructure Monitoring

1. **System Metrics**
   - CPU usage
   - Memory usage
   - Disk I/O
   - Network traffic

2. **Alerts**
   ```yaml
   alerts:
     - name: high-error-rate
       condition: error_rate > 5%
       action: notify-oncall
     - name: low-disk-space
       condition: disk_usage > 90%
       action: scale-storage
   ```

### Recommended Tools

- **Monitoring**: Datadog, New Relic, Grafana
- **Logging**: LogDNA, Papertrail, ELK Stack
- **Error Tracking**: Sentry, Rollbar
- **Uptime**: Pingdom, UptimeRobot

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (requires 18+)
   - Verify all dependencies
   - Check environment variables

2. **Runtime Errors**
   - Verify Supabase connection
   - Check agent deployments
   - Validate JSON in NEXT_PUBLIC_DEPLOYMENTS

3. **Performance Issues**
   - Enable production optimizations
   - Check memory limits
   - Review database queries

### Debug Mode

Set these for verbose logging:

```bash
NODE_ENV=development
DEBUG=oap:*
LOG_LEVEL=debug
```

## Support

- Documentation: [docs.oap.langchain.com](https://docs.oap.langchain.com)
- Issues: [GitHub Issues](https://github.com/langchain-ai/open-agent-platform/issues)
- Discord: [LangChain Discord](https://discord.gg/langchain)