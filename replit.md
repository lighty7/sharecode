# CodeVault

## Overview

CodeVault is a secure, dark-themed code sharing web application inspired by codeshare.io. It allows users to create and share code snippets via unique room URLs. Each room stores text/code content in a PostgreSQL database with auto-save functionality, optional password protection, and expiration settings. No authentication is required for basic usage.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight router)
- **State Management**: TanStack React Query for server state, local React state for UI
- **Styling**: Tailwind CSS with CSS variables for theming (dark mode only)
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Code Editor**: Monaco Editor (@monaco-editor/react) for syntax-highlighted code editing
- **Build Tool**: Vite with React plugin

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (compiled with tsx for development, esbuild for production)
- **API Design**: RESTful endpoints under `/api/` prefix
- **Route Definitions**: Centralized in `shared/routes.ts` with Zod schemas for validation

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: `shared/schema.ts`
- **Key Entity**: `rooms` table with fields for slug (primary key), content, privacy settings, password hash, and timestamps
- **Password Hashing**: Node.js crypto module with scrypt algorithm

### Project Structure
```
├── client/           # Frontend React application
│   ├── src/
│   │   ├── components/  # UI components (shadcn/ui + custom)
│   │   ├── hooks/       # Custom React hooks
│   │   ├── pages/       # Route page components
│   │   └── lib/         # Utilities and query client
├── server/           # Backend Express application
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API route handlers
│   ├── storage.ts    # Database operations
│   └── db.ts         # Database connection
├── shared/           # Shared code between client/server
│   ├── schema.ts     # Drizzle schema definitions
│   └── routes.ts     # API contract definitions with Zod
```

### Key Design Patterns
- **Monorepo Structure**: Client and server in same repository with shared TypeScript code
- **Type Safety**: Zod schemas for API validation shared between frontend and backend
- **Auto-Save**: Debounced content updates (1 second delay) to reduce API calls
- **Room Creation**: Automatic room creation when visiting non-existent slugs
- **Password Protection**: Optional per-room password with scrypt hashing

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Database query builder and schema management
- **drizzle-kit**: Database migration tool (`npm run db:push`)

### Frontend Libraries
- **@monaco-editor/react**: Code editor with syntax highlighting
- **@tanstack/react-query**: Server state management and caching
- **Radix UI**: Accessible UI primitives (dialog, dropdown, toast, etc.)
- **nanoid**: Random room slug generation
- **date-fns**: Date formatting utilities

### Development Tools
- **Vite**: Frontend build and dev server
- **tsx**: TypeScript execution for development
- **esbuild**: Production server bundling
- **Tailwind CSS**: Utility-first CSS framework