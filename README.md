# Job Genie — Frontend

The client side of Job Genie — a tool that helps you build a shortlist of companies you'd actually want to work at, and surfaces open roles at each of them.

## Features

- Sign up or log in with Google or email/password
- Filter companies by industry, size, city, and country
- AI-generated company shortlist based on your criteria
- Browse open roles at each company in a modal view
- Add and remove companies from your wishlist

## Tech stack

- React 19, TypeScript
- Vite
- Axios
- Vitest + React Testing Library
- Prettier, Husky, lint-staged

## Getting started

### Prerequisites

- Node.js v18+
- The [Job Genie backend](https://github.com/fac-32/Job-Genie-Backend) running locally

### Setup

```bash
git clone https://github.com/fac-32/Job-Genie-Frontend.git
cd Job-Genie-Frontend
npm install
```

Copy the dev env file and update values as needed:

```bash
cp .env.development .env.development.local
```

```bash
npm run dev
```

App runs at `http://localhost:5173` by default.

### Tests

```bash
npm test
```

## Project structure

```
src/
├── components/
│   ├── Navbar.tsx
│   ├── LoginModal.tsx
│   ├── SignUpModal.tsx
│   ├── WishlistCard.tsx
│   └── WishlistGenerator.tsx   # Core feature
├── context/                     # Auth state
├── types/
└── App.tsx
```
