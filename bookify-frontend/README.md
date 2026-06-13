# Bookify — AI Library & Audiobooks (Frontend)

> Turn your library into an AI audiobook studio. Upload PDFs, convert them to natural-sounding audio, and share your knowledge with a global community.

[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-purple?logo=vite)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router-7.17-red?logo=reactrouter)](https://reactrouter.com/)

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Features](#features)
5. [Architecture](#architecture)
6. [Getting Started](#getting-started)
7. [Available Scripts](#available-scripts)
8. [API Integration](#api-integration)
9. [Design System](#design-system)
10. [Form Validation](#form-validation)
11. [State Management](#state-management)
12. [Routing](#routing)
13. [Error Handling](#error-handling)
14. [Deployment](#deployment)
15. [Full-Stack Setup](#full-stack-setup)

---

## Overview

**Bookify** is a full-featured AI-powered library management platform. The frontend is a single-page application (SPA) built with **React 19**, **TypeScript 6**, and **Vite 8**, styled with **Tailwind CSS v4**. It communicates with a Spring Boot backend via a REST API, with JWT-based authentication and Axios interceptors for automatic token injection and error handling.

### Core Capabilities

- **Library Management** — Upload, organize, and manage PDF documents with AI-powered categorization
- **AI Audio Conversion** — Convert books to natural-sounding audiobooks with configurable page ranges and voice selection
- **Marketplace** — Discover, search, filter, and purchase books shared by the community
- **Community Features** — Reviews, comments, and real-time chat on every book
- **Subscription Tiers** — Free, Basic ($4.99/mo), and Premium ($9.99/mo) plans with Stripe payment integration
- **Responsive Design** — Works seamlessly across mobile, tablet, and desktop viewports

---

## Tech Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | React | 19.2.6 | UI library |
| **Language** | TypeScript | 6.0.2 | Type safety |
| **Build Tool** | Vite | 8.0.12 | Dev server, HMR, bundling |
| **Styling** | Tailwind CSS | 4.3.0 | Utility-first CSS framework |
| **Routing** | React Router DOM | 7.17.0 | Client-side routing |
| **HTTP Client** | Axios | 1.17.0 | API requests with interceptors |
| **Forms** | React Hook Form | 7.78.0 | Performant form state management |
| **Validation** | Zod | 4.4.3 | Schema-based validation |
| **Icons** | Lucide React | 1.17.0 | Consistent icon library |
| **Utilities** | clsx + tailwind-merge | 2.1.1 / 3.6.0 | Conditional class merging |

### Dev Dependencies

| Tool | Purpose |
|------|---------|
| ESLint 10 + typescript-eslint | Linting with React hooks & refresh plugins |
| @tailwindcss/vite | Tailwind CSS v4 Vite integration |
| @vitejs/plugin-react | React Fast Refresh & JSX transform |
| PostCSS + Autoprefixer | CSS processing |

---

## Project Structure

```
bookify-frontend/
├── index.html                          # Entry HTML with Inter font preconnect
├── package.json                        # Dependencies & scripts
├── vite.config.ts                      # Vite config (port 3000, API proxy)
├── tsconfig.json                       # TypeScript project references
├── tsconfig.app.json                   # App TS config (ES2023, bundler mode)
├── tsconfig.node.json                  # Node TS config (for Vite)
├── eslint.config.js                    # Flat ESLint config
├── public/
│   ├── favicon.svg                     # Bookify brand favicon
│   └── icons.svg                       # SVG sprite (GitHub, Discord, X, etc.)
└── src/
    ├── main.tsx                        # App entry — providers & render
    ├── App.tsx                         # Root component → AppRoutes
    ├── index.css                       # Tailwind imports, theme tokens, animations
    ├── api/                            # API layer
    │   ├── client.ts                   # Axios instance + interceptors
    │   ├── auth.ts                     # login, signup, getMe
    │   ├── books.ts                    # upload, inventory, marketplace, purchase
    │   ├── audio.ts                    # convert, stream, download, usage
    │   ├── community.ts               # reviews, comments, chat
    │   └── subscriptions.ts           # plans, subscribe, checkout
    ├── types/                          # TypeScript interfaces
    │   ├── api.ts                      # ApiError, PaginatedResponse
    │   ├── auth.ts                     # AuthResponse, LoginRequest, SignupRequest
    │   ├── book.ts                     # Book, BookType, UploadStatus, MarketplaceQuery
    │   ├── audio.ts                    # ConversionJob, AudioUsage, AudioConversionRequest
    │   ├── community.ts               # Review, Comment, ChatMessage
    │   └── subscription.ts            # Plan, Subscription, CheckoutRequest
    ├── hooks/                          # Custom React hooks
    │   ├── useBooks.ts                 # useInventory, useMarketplace, useBookDetail, useUploadBook, usePurchaseBook
    │   ├── useAudio.ts                 # useAudioUsage, useAudioConversion
    │   ├── useCommunity.ts            # useReviews, useComments, useChat
    │   └── useSubscription.ts         # usePlans, useCurrentSubscription, useCheckout
    ├── context/                        # React Context providers
    │   └── AuthContext.tsx             # Auth state, login/signup/logout, JWT persistence
    ├── components/
    │   ├── ui/                         # Reusable UI primitives
    │   │   ├── Button.tsx              # 5 variants, 3 sizes, loading state
    │   │   ├── Input.tsx               # Label, error, helper text, ref forwarding
    │   │   ├── Card.tsx                # Card, CardHeader, CardBody, CardFooter
    │   │   └── Badge.tsx               # 5 semantic variants
    │   ├── layout/                     # Page layouts
    │   │   ├── MainLayout.tsx          # Navbar + content + footer (authenticated)
    │   │   ├── AuthLayout.tsx          # Centered card layout (login/signup)
    │   │   └── Navbar.tsx              # Sticky nav, mobile hamburger, active states
    │   └── common/                     # Shared utilities
    │       ├── ProtectedRoute.tsx      # Auth guard with loading spinner
    │       ├── Toast.tsx               # Toast notification system (4 types)
    │       ├── ErrorBoundary.tsx       # Class-based error boundary with retry
    │       ├── FileUpload.tsx          # Drag-and-drop PDF upload with preview
    │       ├── EmptyState.tsx          # Empty state placeholder
    │       └── SkeletonLoader.tsx      # Skeleton, BookCardSkeleton, ListSkeleton
    ├── pages/                          # Page components
    │   ├── LandingPage.tsx             # Public landing with hero, features, pricing
    │   ├── LoginPage.tsx               # Email + password login form
    │   ├── SignupPage.tsx              # Registration form
    │   ├── DashboardPage.tsx           # User's book inventory
    │   ├── UploadPage.tsx              # PDF upload with type selection
    │   ├── MarketplacePage.tsx         # Browse, search, filter public books
    │   ├── BookDetailPage.tsx          # Book details + Reviews/Comments/Chat tabs
    │   ├── AudioLibraryPage.tsx        # Audio conversion job history
    │   ├── AudioConverterPage.tsx       # Convert books to audio
    │   ├── AudioPlayerPage.tsx         # Stream/play converted audio
    │   ├── SubscriptionPage.tsx        # Plan comparison + checkout
    │   └── ProfilePage.tsx             # User profile display
    ├── routes/
    │   └── AppRoutes.tsx               # All route definitions + 404 fallback
    └── utils/
        ├── cn.ts                       # clsx + tailwind-merge helper
        ├── storage.ts                  # localStorage JWT & user persistence
        ├── formatters.ts               # formatDate, formatFileSize, formatCurrency
        └── validators.ts               # Zod schemas for all forms
```

---

## Features

### 🔐 Authentication
- JWT-based login and signup with email + password
- Automatic token persistence in `localStorage`
- Axios request interceptor injects `Authorization: Bearer <token>` on every request
- 401 response interceptor auto-clears auth and redirects to `/login`
- Session restoration on page refresh via `/auth/me` endpoint
- Protected routes redirect unauthenticated users to login

### 📚 Library & Upload
- Upload PDF files via drag-and-drop or file picker
- Three document types: **INFO** (≤2MB free), **BOOK**, **GRAPHICAL**
- File size enforcement per subscription tier
- Upload progress tracking
- Processing status badges (PROCESSING → READY / FAILED)
- Inventory dashboard with book cards

### 🛒 Marketplace
- Paginated book grid with search and type filtering
- Book detail page with metadata, purchase button, and download
- Public/private visibility toggle for owned books
- Purchase flow with success feedback

### 🎧 AI Audio
- Convert any book to audio with configurable page range
- Multiple voice options
- Real-time conversion job status tracking (PENDING → PROCESSING → COMPLETED / FAILED)
- Audio streaming player
- Download converted audio files
- Usage meter showing remaining conversions per billing period

### 💬 Community
- Star ratings + written reviews per book
- Comment threads per book
- Real-time chat per book
- Optimistic UI updates (new items appear instantly)

### 💳 Subscription & Payments
- Three-tier pricing: Free ($0), Basic ($4.99/mo), Premium ($9.99/mo)
- Feature comparison with per-tier limits
- Stripe checkout session integration
- Current subscription status display

### 🎨 UI/UX
- Responsive design (mobile hamburger menu, fluid grids)
- Skeleton loaders for all async content
- Empty states with contextual actions
- Toast notifications (success, error, info, warning)
- Error boundary with reload option
- Custom scrollbar styling
- Focus-visible ring for keyboard accessibility
- Fade-in and slide-up animations

---

## Architecture

### Provider Hierarchy

```
ErrorBoundary
  └── BrowserRouter
      └── AuthProvider (Context)
          └── ToastProvider (Context)
              └── App
                  └── AppRoutes
                      ├── Public: LandingPage, LoginPage, SignupPage
                      └── Protected: ProtectedRoute → MainLayout → Page
```

### Data Flow

```
Page Component
  → Custom Hook (useBooks, useAudio, etc.)
    → API Module (books.ts, audio.ts, etc.)
      → Axios Client (client.ts)
        → Interceptors (token injection, error handling)
          → Backend REST API (/api/*)
            → Vite Proxy (dev) or direct (prod)
```

### API Layer Design

The API layer follows a **module-per-domain** pattern:

- **`client.ts`** — Configured Axios instance with:
  - Base URL from `VITE_API_URL` env var (defaults to `/api` for Vite proxy)
  - 30-second timeout
  - Request interceptor: attaches JWT from localStorage
  - Response interceptor: handles 401 (session expiry), 403 (forbidden), field-level validation errors, network errors

- **Domain modules** (`auth.ts`, `books.ts`, `audio.ts`, `community.ts`, `subscriptions.ts`) — Thin wrappers that call `client` methods and return typed responses.

### Hook Layer Design

Custom hooks encapsulate all data fetching and mutation logic:

| Hook | Returns | Pattern |
|------|---------|---------|
| `useInventory` | `{ books, isLoading, error, refetch }` | Fetch-on-mount + manual refetch |
| `useMarketplace` | `{ result, isLoading, error, query, setQuery, refetch }` | Fetch-on-mount + query-driven refetch |
| `useBookDetail(id)` | `{ book, isLoading, error }` | Fetch-on-mount with cancellation |
| `useUploadBook` | `{ upload, isLoading, error, progress }` | Manual mutation |
| `usePurchaseBook` | `{ purchase, isLoading, error }` | Manual mutation |
| `useAudioUsage` | `{ usage, isLoading, error, refetch }` | Fetch-on-mount + manual refetch |
| `useAudioConversion` | `{ convert, job, isLoading, error }` | Manual mutation with optimistic state |
| `useReviews(bookId)` | `{ reviews, isLoading, error, refetch, createReview }` | Fetch + optimistic create |
| `useComments(bookId)` | `{ comments, isLoading, error, refetch, createComment }` | Fetch + optimistic create |
| `useChat(bookId)` | `{ messages, isLoading, error, refetch, sendMessage }` | Fetch + optimistic send |
| `usePlans` | `{ plans, isLoading, error }` | Fetch-on-mount with cancellation |
| `useCurrentSubscription` | `{ subscription, isLoading, error, refetch }` | Fetch-on-mount + manual refetch |
| `useCheckout` | `{ checkout, isLoading, error }` | Manual mutation (redirects to Stripe) |

All hooks include runtime response validation (e.g., checking that inventory returns an array, marketplace returns a paginated object) with graceful fallbacks and console warnings.

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **npm** ≥ 10
- Backend API running (see [Full-Stack Setup](#full-stack-setup))

### Installation

```bash
# Navigate to the frontend directory
cd bookify-frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The dev server starts at **http://localhost:3000** with hot module replacement (HMR).

### Environment Variables

Create `.env.local` in `bookify-frontend/` (optional — defaults work for dev):

```env
# API base URL — defaults to /api (proxied to backend in dev)
VITE_API_URL=http://localhost:4000/api
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR on port 3000 |
| `npm run build` | Type-check (`tsc -b`) then production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |
| `npx tsc --noEmit --project tsconfig.app.json` | Type-check only (no emit) |

---

## API Integration

### Vite Proxy (Development)

The Vite dev server proxies `/api` requests to the backend:

```ts
// vite.config.ts
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:4000',
      changeOrigin: true,
    },
  },
}
```

This means in development, the frontend calls `/api/auth/login` and Vite forwards it to `http://localhost:4000/api/auth/login`, avoiding CORS issues.

### API Endpoints Consumed

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/auth/signup` | Register new user |
| `POST` | `/api/auth/login` | Authenticate and receive JWT |
| `GET` | `/api/auth/me` | Get current user profile |
| `POST` | `/api/books/upload` | Upload PDF (multipart/form-data) |
| `GET` | `/api/books/inventory` | List user's uploaded books |
| `GET` | `/api/books/marketplace` | Paginated public book listing |
| `GET` | `/api/books/:id` | Get single book details |
| `POST` | `/api/books/:id/purchase` | Purchase a book |
| `GET` | `/api/books/:id/download` | Download book file (blob) |
| `PUT` | `/api/books/:id/visibility` | Toggle public/private |
| `POST` | `/api/audio/convert` | Request audio conversion |
| `GET` | `/api/audio/:id/stream` | Stream converted audio |
| `GET` | `/api/audio/:id/download` | Download audio file (blob) |
| `GET` | `/api/audio/usage` | Get conversion usage stats |
| `GET` | `/api/audio/jobs/:id` | Get conversion job status |
| `GET` | `/api/books/:id/reviews` | List reviews for a book |
| `POST` | `/api/books/:id/reviews` | Add a review |
| `GET` | `/api/books/:id/comments` | List comments for a book |
| `POST` | `/api/books/:id/comments` | Add a comment |
| `GET` | `/api/books/:id/chat` | Get chat history for a book |
| `POST` | `/api/books/:id/chat` | Send a chat message |
| `GET` | `/api/subscriptions/plans` | List available plans |
| `POST` | `/api/subscriptions/subscribe` | Subscribe to a plan |
| `GET` | `/api/subscriptions/me` | Get current subscription |
| `POST` | `/api/payments/checkout` | Create Stripe checkout session |

---

## Design System

### Theme Tokens

The design system is defined via Tailwind CSS v4's `@theme` directive in `index.css`:

```css
@theme {
  --font-sans: 'Inter', system-ui, sans-serif;
  --color-primary-50...900:   Blue palette (#eff6ff → #1e3a8a)
  --color-surface-0...900:   Slate palette (#ffffff → #0f172a)
  --animate-fade-in:          fadeIn 0.2s ease-out
  --animate-slide-up:        slideUp 0.3s ease-out
}
```

### Component Variants

**Button** — 5 variants × 3 sizes:
- `primary` (blue filled), `secondary` (gray filled), `outline` (bordered), `ghost` (text-only), `danger` (red filled)
- `sm`, `md`, `lg` sizes
- `isLoading` prop shows spinner and disables
- `fullWidth` prop for block-level buttons

**Badge** — 5 semantic variants:
- `default` (gray), `success` (green), `warning` (amber), `danger` (red), `info` (blue)

**Toast** — 4 types with auto-dismiss:
- `success` (green, 4s), `error` (red, 4s), `info` (blue, 4s), `warning` (amber, 4s)

### Utility: `cn()`

The `cn()` helper combines `clsx` (conditional classes) with `tailwind-merge` (intelligent conflict resolution):

```ts
import { cn } from '../utils/cn'

// Safely merge conditional Tailwind classes
cn('px-4 py-2', isActive && 'bg-primary-50 text-primary-700')
```

---

## Form Validation

All forms use **React Hook Form** with **Zod** schema validation via `@hookform/resolvers`:

| Form | Schema | Rules |
|------|--------|-------|
| Login | `loginSchema` | Email required + valid format, password 4–8 chars |
| Signup | `signupSchema` | Email, name (≤30 chars), password 4–8 chars |
| Upload | `uploadBookSchema` | Title (≤120 chars), type enum, description (≤500), file required |
| Review | `reviewSchema` | Rating 0.5–5, comment 3–2000 chars |
| Comment | `commentSchema` | Content 1–1000 chars |
| Chat | `chatMessageSchema` | Message 1–2000 chars |
| Audio | `audioConversionSchema` | Book ID positive, start/end page ≥1, optional voice |

---

## State Management

The app uses **React Context** for global state and **custom hooks** for server state:

### AuthContext

- Stores `user`, `isLoading`, `isAuthenticated`
- On mount: checks localStorage for JWT → calls `/auth/me` to validate
- `login()` / `signup()` → calls API → stores token + user in localStorage
- `logout()` → clears localStorage → redirects to `/login`

### ToastContext

- `showToast(message, type)` adds a toast with auto-generated ID
- Toasts auto-dismiss after 4 seconds
- Manual dismiss via close button
- Renders fixed-position toast container at top-right

### Server State (Custom Hooks)

Each domain hook manages its own `isLoading` / `error` / `data` state using `useState` + `useEffect` / `useCallback`. This keeps data fetching colocated with the domain logic and avoids unnecessary global state.

---

## Routing

All routes are defined in `src/routes/AppRoutes.tsx`:

| Path | Component | Auth Required | Layout |
|------|-----------|---------------|--------|
| `/` | `LandingPage` | No | Standalone |
| `/login` | `LoginPage` | No | `AuthLayout` |
| `/signup` | `SignupPage` | No | `AuthLayout` |
| `/dashboard` | `DashboardPage` | Yes | `MainLayout` |
| `/upload` | `UploadPage` | Yes | `MainLayout` |
| `/marketplace` | `MarketplacePage` | Yes | `MainLayout` |
| `/books/:id` | `BookDetailPage` | Yes | `MainLayout` |
| `/audio` | `AudioLibraryPage` | Yes | `MainLayout` |
| `/audio/convert` | `AudioConverterPage` | Yes | `MainLayout` |
| `/audio/player` | `AudioPlayerPage` | Yes | `MainLayout` |
| `/subscription` | `SubscriptionPage` | Yes | `MainLayout` |
| `/profile` | `ProfilePage` | Yes | `MainLayout` |
| `*` (404) | Inline fallback | No | `AuthLayout` |

### ProtectedRoute

The `ProtectedRoute` component:
1. Shows a centered spinner while `isLoading` is true (auth check in progress)
2. Redirects to `/login` if not authenticated
3. Wraps children in `MainLayout` (navbar + footer) if authenticated

---

## Error Handling

The app has a **layered error handling strategy**:

### 1. ErrorBoundary (App-Level)
- Class-based React error boundary wrapping the entire app
- Catches unhandled render errors
- Shows a friendly error UI with the error message and a "Reload page" button
- Logs errors to console for debugging

### 2. Axios Response Interceptor (Network-Level)
- **401** → Clears auth, redirects to `/login`, shows "Session expired" message
- **403** → Shows "You do not have permission" message
- **Field errors** → Joins field-level validation messages into a single string
- **Server errors** → Shows the server's error message or a generic fallback
- **Network errors** (no response) → Shows "Network error. Please check your connection."
- **Unknown errors** → Shows the raw error message

### 3. Hook-Level Error State (Feature-Level)
- Every custom hook exposes an `error` state
- Pages can conditionally render error UI or retry buttons
- Errors are surfaced to the user via toast notifications

### 4. Form-Level Validation (Input-Level)
- Zod schemas provide field-level validation before submission
- React Hook Form displays inline error messages beneath each field
- Server-side validation errors are mapped to form fields when possible

---

## Deployment

### Production Build

```bash
npm run build
```

This runs `tsc -b` (type-checking across the project references) followed by `vite build`. Output goes to `dist/`.

### Serving in Production

The production build is a set of static files. Serve `dist/index.html` for all routes (SPA fallback):

**Nginx example:**
```nginx
server {
    listen 80;
    server_name bookify.example.com;
    root /var/www/bookify-frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**Vite preview (local only):**
```bash
npm run preview
```

---

## Full-Stack Setup

Bookify requires a backend service. See the complete run guide at [`BOOKIFY_RUN_AND_TEST_GUIDE.md`](../BOOKIFY_RUN_AND_TEST_GUIDE.md) in the parent directory.

### Quick Start (All Services)

```bash
# 1. Start infrastructure (PostgreSQL + MinIO)
cd Bookify
docker compose up -d

# 2. Start backend (Spring Boot on port 4000)
./mvnw spring-boot:run

# 3. Start frontend (Vite on port 3000)
cd ../Bookify_frontend/bookify-frontend
npm install
npm run dev

# 4. Open the app
open http://localhost:3000
```

### Infrastructure Ports

| Service | Port | Credentials |
|---------|------|-------------|
| **Frontend (Vite)** | 3000 | — |
| **Backend (Spring Boot)** | 4000 | — |
| **PostgreSQL** | 4010 | `bookify_user` / `bookify_pass` |
| **MinIO (S3)** | 4015 | `minioadmin` / `minioadmin031` |
| **MinIO Console** | 4020 | `minioadmin` / `minioadmin031` |
| **Swagger UI** | 4000 | `/swagger-ui.html` |

---

## Key Dependencies

| Package | Why |
|---------|-----|
| `react` + `react-dom` | UI framework (v19 with React Compiler support) |
| `react-router-dom` | Declarative client-side routing (v7) |
| `axios` | HTTP client with interceptors for auth & error handling |
| `react-hook-form` | Performant form library (minimal re-renders) |
| `zod` + `@hookform/resolvers` | Schema validation integrated with form state |
| `lucide-react` | Tree-shakeable icon library (1,000+ icons) |
| `tailwindcss` + `@tailwindcss/vite` | Utility-first CSS with Vite-native plugin (v4) |
| `clsx` + `tailwind-merge` | Safe conditional class merging without style conflicts |

---

## Browser Support

The app targets modern evergreen browsers:
- Chrome 90+
- Firefox 90+
- Safari 15+
- Edge 90+

Uses native ES2023 features, CSS custom properties, and `import.meta.env` (Vite).

---

## License

Private project. All rights reserved.

---

**Built with React 19, TypeScript 6, Vite 8, and Tailwind CSS v4.**  
Backend API docs available at `http://localhost:4000/swagger-ui.html` when the backend is running.
