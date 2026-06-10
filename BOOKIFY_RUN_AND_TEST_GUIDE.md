# Bookify — Complete Run & Test Guide

**Last Updated:** 2026-06-10  
**Applies to:** Bookify Backend + Frontend

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Quick Start (Full Stack)](#2-quick-start-full-stack)
3. [Backend Deep Dive](#3-backend-deep-dive)
4. [Frontend Deep Dive](#4-frontend-deep-dive)
5. [End-to-End Testing](#5-end-to-end-testing)
6. [API Testing](#6-api-testing)
7. [Frontend Testing](#7-frontend-testing)
8. [Common Issues & Fixes](#8-common-issues--fixes)
9. [Verification Checklist](#9-verification-checklist)

---

## 1. Prerequisites

### System Requirements

| Tool | Minimum Version | Purpose |
|------|----------------|---------|
| **Java** | 21 LTS | Backend runtime |
| **Maven** | 3.9+ | Backend build tool |
| **Docker** | 24+ | PostgreSQL + MinIO containers |
| **Node.js** | 20+ | Frontend runtime |
| **npm** | 10+ | Frontend package manager |
| **Git** | 2.40+ | Source control |

### Verify Prerequisites

```bash
# Java
java -version          # Should print "openjdk 21" or similar
javac -version

# Maven
mvn -version           # Should be 3.9.x+

# Docker
docker --version       # Should be 24.x+
docker compose version # Should be 2.x+

# Node.js
node -v                # Should be v20.x+
npm -v                 # Should be 10.x+
```

---

## 2. Quick Start (Full Stack)

### Step 1: Start Infrastructure (PostgreSQL + MinIO)

```bash
# Navigate to backend project root
cd Bookify

# Start containers in detached mode
docker compose up -d

# Verify containers are healthy
docker compose ps

# Expected output:
# NAME                    STATUS   PORTS
# bookify-db              Up       0.0.0.0:4010->5432/tcp
# bookify-minio-storage   Up       0.0.0.0:4015->9000/tcp, 0.0.0.0:4020->9001/tcp
```

### Step 2: Start the Backend

```bash
# In the Bookify directory (backend root)
./mvnw spring-boot:run

# Or on Windows:
# mvnw.cmd spring-boot:run

# Wait for startup log:
# "Started BookifyApplication in X.XXX seconds"
# "Tomcat started on port(s): 4000 (http)"
```

**Verify backend is up:**
```bash
curl http://localhost:4000/api/auth/me
# Expected: 401 Unauthorized (protected endpoint, but server is responding)
```

### Step 3: Start the Frontend

```bash
# In a new terminal, navigate to frontend
cd Bookify_frontend/bookify-frontend

# Install dependencies (if not already done)
npm install

# Start dev server
npm run dev

# Wait for:
# "VITE v8.x.x  ready in XXX ms"
# "➜  Local:   http://localhost:3000/"
```

### Step 4: Open the Application

```bash
# Open in browser
open http://localhost:3000

# Or manually navigate to:
# http://localhost:3000
```

---

## 3. Backend Deep Dive

### Directory Structure

```
Bookify/
├── docker-compose.yml          # PostgreSQL + MinIO services
├── pom.xml                     # Maven configuration
├── src/main/java/com/example/Bookify/
│   ├── BookifyApplication.java # Entry point
│   ├── config/                 # WebSecurityConfig, CORS
│   ├── controller/             # AuthController, BookController, etc.
│   ├── dto/                    # AuthResponse, SignupRequest, etc.
│   ├── entity/                 # User, Book, etc.
│   ├── service/                # Business logic layer
│   ├── repository/             # Spring Data JPA interfaces
│   └── util/                   # JWT utilities, MinIO client
├── src/main/resources/
│   └── application.yaml        # Database, MinIO, JWT config
└── src/test/java/              # Unit & integration tests
```

### Backend Configuration

**`application.yaml` key values:**
```yaml
server:
  port: 4000

spring:
  datasource:
    url: jdbc:postgresql://localhost:4010/bookify_db
    username: bookify_user
    password: bookify_pass
  jpa:
    hibernate:
      ddl-auto: update

minio:
  endpoint: http://localhost:4015
  access-key: minioadmin
  secret-key: minioadmin031

jwt:
  secret: ${JWT_SECRET:bookify-default-secret-key-must-be-32-bytes-long}
  expiration: 432000000  # 5 days in milliseconds
```

### Backend Build Commands

```bash
# Clean build
./mvnw clean package -DskipTests

# Run tests
./mvnw test

# Run with specific profile
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Generate test coverage report
./mvnw jacoco:report
```

### Backend Logs & Debugging

```bash
# View logs in real-time
./mvnw spring-boot:run | tee backend.log

# Enable DEBUG logging
# Add to application.yaml:
logging:
  level:
    com.example.Bookify: DEBUG
    org.springframework.security: DEBUG
```

### Database Access

```bash
# Connect to PostgreSQL directly
psql -h localhost -p 4010 -U bookify_user -d bookify_db

# Common queries
\dt                    # List tables
SELECT * FROM users;   # View users
SELECT * FROM books;   # View books
```

### MinIO Console Access

- **URL:** http://localhost:4020
- **Username:** `minioadmin`
- **Password:** `minioadmin031`
- **Buckets:** `bookify-books` (auto-created on first upload)

---

## 4. Frontend Deep Dive

### Directory Structure

```
bookify-frontend/
├── src/
│   ├── api/              # Axios client + service modules
│   ├── components/
│   │   ├── ui/           # Reusable primitives (Button, Input, Card)
│   │   ├── layout/       # Navbar, MainLayout, AuthLayout
│   │   └── common/       # Toast, ProtectedRoute, FileUpload
│   ├── context/          # AuthContext (JWT state)
│   ├── hooks/            # useBooks, useAudio, useCommunity
│   ├── pages/            # All page components
│   ├── routes/           # AppRoutes.tsx
│   ├── types/            # TypeScript interfaces
│   └── utils/            # cn, storage, formatters, validators
├── vite.config.ts        # Dev server + API proxy
└── package.json
```

### Frontend Commands

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview

# Type checking
npx tsc --noEmit --project tsconfig.app.json

# Lint
npm run lint
```

### Environment Variables

Create `.env.local` in `bookify-frontend/`:
```env
# API Base URL (default is /api which is proxied in dev)
VITE_API_URL=http://localhost:4000/api

# Optional: Enable React DevTools profiling
VITE_PROFILING=true
```

### Build Output

```bash
npm run build

# Creates dist/ folder:
# dist/
#   ├── index.html
#   ├── assets/
#   │   ├── index-XXXXXX.js    # Bundled JS
#   │   └── index-XXXXXX.css   # Bundled CSS
```

---

## 5. End-to-End Testing

### Complete User Flow Test

Follow this exact sequence to verify the entire application works:

#### Test 1: Authentication Flow

```bash
# 1. Navigate to http://localhost:3000
# 2. Click "Get started" → Sign Up page
# 3. Fill form:
#    - Full name: "Test User"
#    - Email: "test@example.com"
#    - Password: "pass12"
# 4. Submit → Should redirect to Dashboard
# 5. Check browser DevTools → Application → Local Storage
#    - Should see: bookify_token (JWT string)
#    - Should see: bookify_user (JSON object)
# 6. Refresh page → Should stay logged in
# 7. Click "Log out" → Should redirect to login
# 8. Try accessing /dashboard directly → Should redirect to /login
```

#### Test 2: Book Upload (Free Tier)

```bash
# 1. Log in with test account
# 2. Navigate to Upload page
# 3. Verify only "INFO" type is selectable (Free tier)
# 4. Try selecting "BOOK" or "GRAPHICAL" → Should show "Premium" badge
# 5. Select a small PDF (≤2MB)
# 6. Fill title and description
# 7. Submit → Toast: "Book uploaded successfully!"
# 8. Navigate to Dashboard → Book should appear with "PROCESSING" badge
```

#### Test 3: Marketplace Browsing

```bash
# 1. Navigate to Marketplace
# 2. Verify books grid loads
# 3. Type in search box: "Clean" → Press Enter
# 4. Verify search results filter
# 5. Click "Book" filter pill → Only BOOK type should show
# 6. Click pagination Next/Prev → Verify page changes
```

#### Test 4: Book Purchase & Detail

```bash
# 1. Click any book in Marketplace
# 2. Verify Book Detail page loads with metadata
# 3. Click "Purchase" button
# 4. Verify success toast
# 5. Book should now show "Purchased" badge
# 6. Verify Reviews/Comments/Chat tabs are accessible
# 7. Add a review (select 4 stars, write comment)
# 8. Add a comment
# 9. Add a chat message
```

#### Test 5: Audio Conversion (Free Tier)

```bash
# 1. Navigate to Audio → Converter
# 2. Verify usage meter shows "0 / 5" for Free plan
# 3. Select a book from inventory
# 4. Set page range (1 to 10)
# 5. Select a voice
# 6. Click "Start Audio Conversion"
# 7. Verify job card appears with PENDING/PROCESSING status
# 8. Check usage meter updated to "1 / 5"
```

#### Test 6: Subscription & Payment

```bash
# 1. Navigate to Subscription page
# 2. Verify Free and Premium plans are displayed
# 3. Click "Subscribe" on Premium
# 4. Verify redirect to Stripe checkout (or mock in dev)
# 5. After successful payment, verify plan upgraded to Premium
```

---

## 6. API Testing

### Using Swagger UI (Interactive)

```bash
# Open in browser:
open http://localhost:4000/swagger-ui.html

# Or navigate manually to:
# http://localhost:4000/swagger-ui.html
```

**Test via Swagger:**
1. Expand `POST /api/auth/signup`
2. Click "Try it out"
3. Enter request body:
   ```json
   {
     "username": "api-test@example.com",
     "name": "API Test",
     "password": "test12"
   }
   ```
4. Click Execute
5. Verify 200 response with token and user object

### Using curl

```bash
# BASE URL
BASE="http://localhost:4000/api"

# 1. Sign up
curl -X POST "$BASE/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{"username":"curl@example.com","name":"Curl User","password":"pass12"}'

# 2. Log in
curl -X POST "$BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"curl@example.com","password":"pass12"}'

# 3. Get current user (replace <token> with actual JWT)
curl -X GET "$BASE/auth/me" \
  -H "Authorization: Bearer <token>"

# 4. Upload a book (multipart)
curl -X POST "$BASE/books/upload" \
  -H "Authorization: Bearer <token>" \
  -F "file=@/path/to/sample.pdf" \
  -F "type=INFO" \
  -F "title=Test Book" \
  -F "description=A test upload"

# 5. List inventory
curl -X GET "$BASE/books/inventory" \
  -H "Authorization: Bearer <token>"

# 6. List marketplace
curl -X GET "$BASE/books/marketplace?page=0&size=10" \
  -H "Authorization: Bearer <token>"
```

### Using HTTPie (Alternative to curl)

```bash
# Install: pip install httpie

# Sign up
http POST localhost:4000/api/auth/signup \
  username=api@example.com \
  name="HTTPie User" \
  password="pass12"

# Log in
http POST localhost:4000/api/auth/login \
  username=api@example.com \
  password="pass12"

# Get me (token from previous response)
http GET localhost:4000/api/auth/me \
  Authorization:"Bearer eyJhbGciOiJIUzI1NiIs..."
```

### Using Postman

**Collection Setup:**
1. Create new Collection: "Bookify API"
2. Set base URL variable: `{{base_url}} = http://localhost:4000/api`
3. Create environment: "Bookify Local"

**Request Templates:**

| Request | Method | URL | Body | Tests |
|---------|--------|-----|------|-------|
| Sign Up | POST | `{{base_url}}/auth/signup` | JSON: `{username, name, password}` | Assert 200, token exists |
| Login | POST | `{{base_url}}/auth/login` | JSON: `{username, password}` | Save token to environment |
| Get Me | GET | `{{base_url}}/auth/me` | None | Bearer: `{{token}}` |
| Upload | POST | `{{base_url}}/books/upload` | form-data: file, type, title | Assert 200, id exists |
| Inventory | GET | `{{base_url}}/books/inventory` | None | Bearer: `{{token}}` |
| Marketplace | GET | `{{base_url}}/books/marketplace` | Query: page, size | Bearer: `{{token}}` |
| Convert Audio | POST | `{{base_url}}/audio/convert` | JSON: `{bookId, startPage, endPage}` | Assert jobId |
| Usage | GET | `{{base_url}}/audio/usage` | None | Assert remaining >= 0 |
| Plans | GET | `{{base_url}}/subscriptions/plans` | None | Bearer: `{{token}}` |

---

## 7. Frontend Testing

### Manual UI Test Checklist

#### Responsive Design
```bash
# Test at these viewports:
# - Mobile: 375px (iPhone SE)
# - Tablet: 768px (iPad)
# - Desktop: 1440px

# In Chrome DevTools:
# 1. Toggle Device Toolbar (Cmd+Shift+M)
# 2. Select "iPhone SE" preset
# 3. Navigate through all pages
# 4. Verify navbar collapses to hamburger menu
# 5. Verify grids switch to single column
# 6. Verify forms are fully usable
```

#### Form Validation
```bash
# Login Page:
# - Submit empty form → Field errors appear
# - Enter invalid email → "Please enter a valid email address"
# - Enter password "ab" → "Password must be at least 4 characters"
# - Enter password "toolongpassword" → "Password must be at most 8 characters"

# Sign Up Page:
# - Duplicate email → "User already exists with username: ..."
# - Name > 30 chars → "Name must be at most 30 characters"

# Upload Page:
# - Submit without file → "Please select a PDF file"
# - Upload non-PDF → Client should reject (accept attribute)
# - Upload >2MB on Free tier → "File exceeds 2MB limit"
```

#### Error States
```bash
# Test error handling:
# 1. Stop backend server
# 2. Try to log in → Toast: "Network error. Please check your connection."
# 3. Restart backend with wrong DB config
# 4. Try API call → Toast: "An unexpected error occurred"
```

#### Token Expiry
```bash
# Simulate expired token:
# 1. Open DevTools → Application → Local Storage
# 2. Modify bookify_token to invalid string "invalid.token.here"
# 3. Refresh page → Should redirect to /login
# 4. Toast should show: "Session expired. Please log in again."
```

### Browser DevTools Testing

```bash
# Network Tab
# 1. Open DevTools → Network tab
# 2. Filter by "Fetch/XHR"
# 3. Navigate through app
# 4. Verify:
#    - All API calls return 200/201
#    - Request headers include "Authorization: Bearer ..."
#    - Response Content-Type is application/json
#    - No CORS errors (except for MinIO direct access if attempted)

# Console Tab
# 1. Watch for React warnings
# 2. Verify no "key" prop warnings in lists
# 3. Verify no unhandled promise rejections

# Application Tab
# 1. Local Storage → Verify bookify_token and bookify_user
# 2. Clear storage → Refresh → Should redirect to login
```

### Performance Testing

```bash
# Lighthouse Audit (Chrome DevTools)
# 1. Open DevTools → Lighthouse tab
# 2. Categories: Performance, Accessibility, Best Practices, SEO
# 3. Device: Mobile
# 4. Click "Analyze page load"
# 5. Target scores:
#    - Performance: > 80
#    - Accessibility: > 90
#    - Best Practices: > 90
#    - SEO: > 80
```

---

## 8. Common Issues & Fixes

### Backend Issues

#### Issue: `Connection refused` to PostgreSQL
```bash
# Symptom: Backend fails to start with DB connection error
# Fix:
docker compose ps              # Check container status
docker compose logs bookify-db  # Check DB logs
docker compose up -d --force-recreate  # Recreate containers
```

#### Issue: MinIO bucket not found
```bash
# Symptom: File upload fails with 500
# Fix:
# 1. Open MinIO Console: http://localhost:4020
# 2. Login: minioadmin / minioadmin031
# 3. Create bucket: "bookify-books"
# 4. Set access policy to "public" or configure accordingly
```

#### Issue: JWT token validation fails
```bash
# Symptom: 401 on every protected endpoint
# Fix:
# 1. Check application.yaml jwt.secret length
# 2. Must be at least 32 characters for HS256
# 3. Regenerate token by logging in again
```

#### Issue: CORS errors in browser
```bash
# Symptom: Frontend shows CORS preflight errors
# Fix:
# 1. Backend WebSecurityConfig should allow origins
# 2. Or use Vite proxy (already configured in vite.config.ts)
# 3. Verify you're accessing frontend via http://localhost:3000 (not 127.0.0.1)
```

### Frontend Issues

#### Issue: `npm install` fails
```bash
# Symptom: EACCES or permission errors
# Fix:
sudo chown -R $(whoami) ~/.npm
npm config set prefix ~/.npm
export PATH=~/.npm/bin:$PATH

# Or use npx directly:
npx --yes vite@latest
```

#### Issue: Tailwind styles not applying
```bash
# Symptom: App looks unstyled (no colors, no layout)
# Fix:
# 1. Check if @tailwindcss/vite plugin is installed
npm ls @tailwindcss/vite

# 2. Verify vite.config.ts imports tailwindcss plugin
# 3. Check index.css uses @import "tailwindcss" (v4 syntax)
# 4. Restart dev server
```

#### Issue: API proxy not working
```bash
# Symptom: Frontend requests 404 on /api/...
# Fix:
# 1. Check vite.config.ts proxy config
# 2. Verify backend is running on localhost:4000
# 3. Try accessing API directly: curl http://localhost:4000/api/auth/signup
# 4. Check browser Network tab for request URL
```

#### Issue: React Router 404 on refresh
```bash
# Symptom: Refresh on /dashboard shows 404
# Fix:
# Dev server: Vite handles SPA routing automatically
# Production: Configure web server to serve index.html for all routes
# Example nginx config:
location / {
  try_files $uri $uri/ /index.html;
}
```

---

## 9. Verification Checklist

### Backend Verification

- [ ] Docker containers running (`docker compose ps`)
- [ ] Spring Boot starts without errors
- [ ] Swagger UI accessible at http://localhost:4000/swagger-ui.html
- [ ] Sign up API returns JWT token
- [ ] Login API returns JWT token
- [ ] `GET /api/auth/me` works with valid token
- [ ] Upload API accepts multipart form data
- [ ] MinIO bucket exists and is writable
- [ ] PostgreSQL tables auto-created (check with `\dt`)

### Frontend Verification

- [ ] `npm run dev` starts without errors
- [ ] `npm run build` completes successfully
- [ ] Landing page renders with all sections
- [ ] Sign up creates account and stores JWT
- [ ] Login authenticates existing user
- [ ] Dashboard shows uploaded books
- [ ] Upload page enforces file size limits
- [ ] Marketplace shows public books
- [ ] Book detail page shows tabs (Reviews/Comments/Chat)
- [ ] Audio converter submits job and shows status
- [ ] Audio player loads and plays stream
- [ ] Subscription page shows plans
- [ ] Profile page displays user info
- [ ] Logout clears token and redirects

### Integration Verification

- [ ] Frontend can reach backend API (no CORS errors)
- [ ] File upload flows from browser → backend → MinIO
- [ ] JWT persists across page refreshes
- [ ] Token expiry redirects to login
- [ ] Error responses show user-friendly toast messages
- [ ] Mobile navigation works (hamburger menu)
- [ ] Responsive layout works on all screen sizes

---

## Quick Reference Commands

```bash
# === INFRASTRUCTURE ===
cd Bookify
docker compose up -d
docker compose down
docker compose logs -f

# === BACKEND ===
cd Bookify
./mvnw spring-boot:run
./mvnw clean package -DskipTests
./mvnw test

# === FRONTEND ===
cd bookify-frontend
npm install
npm run dev          # http://localhost:3000
npm run build
npm run preview
npx tsc --noEmit --project tsconfig.app.json

# === API TESTS ===
curl http://localhost:4000/swagger-ui.html
curl http://localhost:4000/v3/api-docs

# === MINIO ===
open http://localhost:4020
# Login: minioadmin / minioadmin031

# === DATABASE ===
psql -h localhost -p 4010 -U bookify_user -d bookify_db
```

---

**Need help?** Check the backend OpenAPI spec at `http://localhost:4000/v3/api-docs` or the Swagger UI at `http://localhost:4000/swagger-ui.html` for live API documentation.
