# Contributing to GFG Chapter Website

There are two ways to run it locally — pick whichever you're comfortable with, you don't need both.

- **Option A: Bun directly** — faster iteration, hot reload feels instant, but you need Mongo running separately.
- **Option B: Docker Compose** — one command, spins up frontend + backend + MongoDB together. Best if you don't want to install Mongo locally, or you're on Windows and don't want native Bun setup headaches.

---

## 0. Prerequisites

| Tool | Needed for | Install |
|---|---|---|
| [Bun](https://bun.sh) | Option A (and building images for Option B) | `curl -fsSL https://bun.sh/install \| bash` |
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | Option B only | docker.com |
| Git | Both | — |

Check Bun is installed:
```bash
bun --version
```

---

## 1. Clone and get env files ready

```bash
git clone https://github.com/Aa5hut0sh/gfg_website.git
cd gfg_website
```

The project has two separate apps: `Backend/` (Express API) and `client/` (React frontend). Each needs its own `.env` file — **never commit these**, they're already in `.gitignore`.

### Backend env
```bash
cp Backend/.env.example Backend/.env
```
Then open `Backend/.env` and fill in real values:
```env
PORT=3000
DB_URL='mongodb://127.0.0.1:27017/gfg'
ADMIN_SIGNUP_SECRET="pick-your-own-secret"
JWT_SECRET="pick-a-long-random-string"
JWT_REFRESH_SECRET="pick-a-different-long-random-string"
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
GITHUB_TOKEN=your_github_token
```

### Frontend env
create `client/.env` manually:
```bash
touch client/.env
```
```env
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```
---

## Option A — Run natively with Bun

### 1. Start MongoDB
If you don't already have Mongo running locally, the easiest way is a single throwaway container (you don't need full Docker Compose for this):
```bash
docker run -d -p 27017:27017 --name gfg-mongo-dev mongo:latest
```
Or install MongoDB Community Edition natively if you prefer no Docker at all.

### 2. Install dependencies and run the backend
```bash
cd Backend
bun install
bun run index.ts
```
You should see:
```
MongoDB connected
App is listening on PORT = 3000
```
Confirm it's alive: open `http://localhost:3000/health` — you should get `{"status":"ok", ...}`.

### 3. Install dependencies and run the frontend
In a **new terminal tab**:
```bash
cd client
bun install
bun run dev
```
Vite will print a local URL — usually `http://localhost:5173`. Open it in your browser.

### 4. You're running locally
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`
- Mongo: `localhost:27017`

To stop: `Ctrl+C` both terminals, and if you used the throwaway Mongo container: `docker stop gfg-mongo-dev`.

---

## Option B — Run with Docker Compose

This spins up all three services (frontend, backend, MongoDB) together, networked so they can talk to each other by service name.




### 1. Build and start everything
From the project root:
```bash
docker compose up --build
```
First run takes a few minutes (installing deps inside containers). Subsequent runs are fast — code is volume-mounted, so edits on your machine reflect inside the containers without rebuilding.

### 2. Access the app
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`
- Mongo: `localhost:27017`, database `gfg`

### 3. Stop everything
```bash
docker compose down
```
Add `-v` if you also want to wipe the Mongo volume (`docker compose down -v`) — fresh database next start.

### Notes
- If you change `Backend/package.json` or `client/package.json` (add a dependency), re-run with `--build` so the image reinstalls: `docker compose up --build`.

---

## Day-to-day workflow

1. Pull latest `main`, create a branch: `git checkout -b feature/short-description`
2. Make your change, test locally (Option A or B).
3. Push and open a PR against `main`. Fill in what you changed and how you tested it.
4. Tag Me or Vedant for review — don't merge your own PR.