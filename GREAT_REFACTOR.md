A comprehensive plan to transform **Stacks** from a local-only vanilla JS game into a multiplayer web application supported by AWS.

---

## 📋 Table of Contents

1. [Vision Overview](#vision-overview)
2. [Current State](#current-state)
3. [Target Architecture](#target-architecture)
4. [Phase Breakdown](#phase-breakdown)

---

## Vision Overview

Transform Stacks into a modern, scalable web game with:
- **React-based frontend** with overhauled visuals
- **Serverless backend** using AWS Lambda (C#)
- **Real-time multiplayer** via API Gateway -> AWS Lambda
- **Persistent game state** with DynamoDB
- **User authentication** for online play

---

## Current State

### Frontend
- Vanilla HTML/JS/CSS
- Two main pages: `front-page.html` (landing) and `local.html` (game)
- Game logic lives entirely in browser (`/scripts/local/`)
  - `game-master.js` - Main orchestrator
  - `board.js` - Board rendering/state
  - `pieces.js` - Piece definitions and movement
  - `tiles.js` - Tile management
  - `turn-manager.js` - Turn state machine
  - `game-effector.js` - Visual effects
  - `enums.js` - Game constants

### Assets
- Piece images (red/blue variants): Brute, Ghost, Numeric 1-4
- Dice face images (1-6)
- Logo and backdrop images

---

## Target Architecture

```
┌─────────────────────────┐
│     React Frontend      │
│  (Vite + TypeScript)    │
└───────────┬─────────────┘
            │ HTTPS
            ▼
┌─────────────────────────┐
│   API Gateway (HTTP)    │
│  - POST /game (create)  │
└───────────┬─────────────┘
            │ Event (JSON)
            ▼
┌─────────────────────────┐
│    AWS Lambda (C#)      │
│  - Validate moves       │
│  - Apply game rules     │
│  - Enforce turns        │
│  - Auth logic           │
└───────────┬─────────────┘
            │ SDK calls
            ▼
┌─────────────────────────┐
│       DynamoDB          │
│                         │
│  Table: Users           │
│   PK: UserId            │
│   Attributes: username, │
│   stats, ...            │
│                         │
│  Table: Games           │
│   PK: GameId            │
│   SK: State / Move#     │
│   Attributes: board,    │
│   players, turn, status │
└─────────────────────────┘
```

---

## Git Branches

### `feature/react-migration`
**Goal:** Migrate frontend from vanilla JS to React + TypeScript

**Scope:**
- Initialize Vite + React + TypeScript project
- Create component architecture:
  - `App.tsx` - Router and layout
  - `pages/Home.tsx` - Landing page
  - `pages/CreateMatch.tsx` - Match creation page
  - `play/Online.tsx` - Multiplayer game
  - `play/Computer.tsx` - Game against a bot
  - `components/Board/` - Board, Tile, Piece components
  - `components/Dice/` - Dice display and interaction
  - `components/UI/` - Navbar, Settings, Buttons
- Convert enums to TypeScript

**Deliverables:**
- [ ] Vite project scaffolding
- [ ] All pages converted to React components

---

### `feature/visual-overhaul`
**Goal:** Complete visual redesign with modern aesthetics

**Scope:**
- New design system and color palette
- Implement CSS-in-JS or Tailwind CSS
- Enhanced animations and transitions:
  - Piece movement animations
  - Dice roll effects
  - Turn transition effects
  - Victory/defeat sequences
- Responsive design overhaul
- Improved board design with depth/shadows
- Loading states and skeleton screens

**Deliverables:**
- [ ] Design system documentation
- [ ] New color palette and typography
- [ ] Animated piece movements
- [ ] Dice roll animations
- [ ] Responsive layout
- [ ] Polished settings menu

---

### `feature/lambda-backend`
**Goal:** Create C# Lambda functions for game logic

**Scope:**
- .NET Lambda project setup (AWS SAM or CDK)
- Core game logic in C#:
  - Move validation
  - Turn enforcement
  - Dice rolling
  - Win condition checking
  - Game state management
- Lambda handlers:
  - `CreateGameHandler` - Initialize new game
  - `GetGameHandler` - Fetch game state
  - `MakeMoveHandler` - Process player moves
  - `AuthHandler` - Authentication
- Local testing with SAM CLI

**Deliverables:**
- [ ] .NET project structure
- [ ] Game logic classes (Board, Piece, Move, etc.)
- [ ] Lambda function handlers
- [ ] SAM/CDK template

---

### `feature/dynamodb-integration`
**Goal:** Set up DynamoDB tables and data access layer

**Scope:**
- DynamoDB table design:
  - **Users Table**
    - PK: `UserId` (GUID)
    - Attributes: `username`, `passwordHash`, `createdAt`, `stats`
  - **Games Table**
    - PK: `GameId` (GUID)
    - SK: `State` (for current state) or `Move#{n}` (for history)
    - Attributes: `boardState`, `player1Id`, `player2Id`, `currentTurn`, `status`, `createdAt`
- Data access layer in C#
- Game state serialization/deserialization

**Deliverables:**
- [ ] .NET SDK for table creation and DAL
- [ ] Repository classes for data access
- [ ] Game state serialization logic

---

### `feature/api-gateway`
**Goal:** Set up API Gateway and connect frontend

**Scope:**
- HTTP API Gateway configuration
- Some example routes:
  - `POST /auth/login` - User login
  - `POST /auth/register` - User registration
  - `POST /games` - Create new game
  - `GET /games/{gameId}` - Get game state
  - `POST /games/{gameId}/moves` - Make a move
- CORS configuration for frontend
- Request/response validation
- JWT authentication
- Connect Lambda functions to routes

**Deliverables:**
- [ ] All routes configured
- [ ] CORS properly set up
- [ ] Authentication middleware
- [ ] API documentation

---

### `feature/frontend-api-integration`
**Goal:** Connect React frontend to AWS backend

**Scope:**
- API client service (`services/api.ts`)
- Authentication flow:
  - Login/Register forms
  - Token storage
  - Protected routes
- Online game mode:
  - Game lobby/matchmaking UI
  - Create game flow
  - Join game flow
- Real-time state polling
- Error handling and loading states

**Deliverables:**
- [ ] API client with typed responses
- [ ] Auth context and hooks
- [ ] Login/Register pages
- [ ] Online game creation/joining
- [ ] Game state synchronization

---

### `feature/deployment`
**Goal:** Production deployment pipeline

**Scope:**
- Frontend hosting (S3 + CloudFront or Amplify)
- CI/CD pipeline (GitHub Actions)
- Domain setup

**Deliverables:**
- [ ] Frontend deployment pipeline
- [ ] Backend deployment pipeline
- [ ] Documentation for deployment
- [ ] Monitoring dashboards (optional)

---

## Phase Breakdown

| Phase | Branches | Duration Estimate | Description |
|-------|----------|-------------------|-------------|
| **1** | `react-migration` | 3-4 weeks (Dec 27 - January 23) | Foundation - get React working with existing game |
| **2** | `visual-overhaul` | 2-3 weeks (January 24 - February 14) | Overhaul UI-UX |
| **3** | `lambda-backend` + `dynamodb-integration` | 3-4 weeks (February 15 - March 15) | Build the serverless backend |
| **4** | `api-gateway` | 2 weeks (March 16 - March 30) | Wire up the API |
| **5** | `frontend-api-integration` | 2-3 weeks (March 31 - April 21) | Connect frontend to backend |
| **6** | `deployment` | 2 weeks (April 22 - May 6) | Finalize initial deployment |

**Rought Total Estimate:** 14-18 weeks

---
