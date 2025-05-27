# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Professionator is a Next.js application that helps users transform casual or harsh messages into professional, diplomatic communication. Users input their raw thoughts and the app uses AI (Google Gemini) to rephrase them professionally while preserving the original intent and information.

## Development Commands

```bash
# Development
bun dev                  # Start development server with Turbopack
bun run build            # Build for production
bun start                # Start production server
bun run lint             # Run ESLint

# Database (Drizzle + Cloudflare D1)
bun run db:generate      # Generate migrations from schema changes
bun run db:check         # Check migration validity
bun run db:push          # Push schema changes directly to database
bun run db:migrate       # Apply migrations to remote D1 database
bun run db:migrate:local # Apply migrations to local D1 database
bun run db:studio        # Open Drizzle Studio

# Cloudflare Deployment
bun run preview          # Build and preview Cloudflare deployment locally
bun run deploy           # Build and deploy to Cloudflare
bun run cf-typegen       # Generate Cloudflare environment types
```

## Architecture

### Frontend (Next.js App Router)
- **Main app**: `src/app/page.tsx` - Single-page chat interface with tabs for input/output
- **Layout**: `src/app/layout.tsx` - Raleway/Geist fonts, PostHog analytics, responsive viewport
- **API**: `src/app/api/chat/route.ts` - Streaming chat endpoint using AI SDK
- **UI**: shadcn/ui components in `src/components/ui/` with Tailwind + DaisyUI styling

### Backend & Data
- **Database**: Cloudflare D1 (SQLite) with Drizzle ORM
- **Schema**: `src/server/db/schema.ts` - Simple messages table (content, translation, timestamp)
- **AI Provider**: Google Gemini 2.5 Flash with thinking budget configuration
- **Analytics**: PostHog with custom event tracking

### Deployment
- **Platform**: Cloudflare Workers via OpenNext
- **Configuration**: `wrangler.jsonc` defines D1 database, KV storage, and R2 bucket bindings
- **Environment**: Uses Cloudflare bindings for database credentials and API keys

## Key Patterns

### AI Chat Integration
- Uses `@ai-sdk/react` useChat hook for streaming responses
- Custom processing stages with loading states and error handling
- Language selection affects the AI system prompt for multilingual output

### State Management
- React state for UI (tabs, language selection, error states)
- Chat state managed by AI SDK useChat hook
- PostHog event tracking for user interactions

### Database Operations
- Drizzle ORM with type-safe queries
- Messages stored for analytics (content logging)
- Schema migrations handled via Drizzle Kit

### Error Handling
- Frontend error boundaries with retry mechanisms
- API error responses with structured JSON
- Database operation error logging

## Environment Variables
Required for full functionality:
- `GOOGLE_API_KEY` - Google Gemini API access
- `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_DATABASE_ID`, `CLOUDFLARE_D1_TOKEN` - D1 database
- `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` - Analytics
- `PRODUCTION`, `PRODUCTION_URL` - Environment detection and metadata