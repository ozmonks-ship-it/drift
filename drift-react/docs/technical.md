# Drift — Technical Document

## Stack

| Layer | Tool | Purpose |
|-------|------|---------|
| Design | Figma + Figma Make | UI design and React export |
| Frontend | React + TypeScript | App framework |
| Styling | Tailwind CSS | Utility-first styling |
| Build | Vite | Fast dev server and bundler |
| Database | Supabase (Postgres) | Task persistence |
| AI | Claude API (Sonnet) | Intelligent task prioritisation |
| Version Control | GitHub | Code storage and history |
| Hosting | Vercel | Live deployment |
| Editor | Cursor | AI-assisted coding |

---

## Repository

- **GitHub:** `https://github.com/ozmonks-ship-it/drift`
- **Live URL:** Vercel project dashboard
- **Branch:** `main` (auto-deploys to Vercel on push)

---

## Local Setup

### Prerequisites
- Node.js (LTS version)
- Cursor editor
- Git

### Running locally

```bash
cd "Drift React"
npm install
npm run dev
```

App runs at `http://localhost:5173`

### Environment Variables

Create a `.env` file in the `Drift React` folder:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_CLAUDE_API_KEY=your_claude_api_key
```

⚠️ Never commit `.env` to GitHub. It is listed in `.gitignore`.

---

## Project Structure

```
Drift React/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── figma/        # Figma Make components
│   │   │   └── ui/           # UI component library
│   │   ├── context/
│   │   │   └── TaskContext.tsx   # Global task state
│   │   └── pages/
│   │       ├── Home.tsx      # Entry point
│   │       ├── Add.tsx       # Capture a task
│   │       ├── Next.tsx      # The Pick — one task shown
│   │       ├── Working.tsx   # Active task view
│   │       └── Done.tsx      # Completion celebration
│   ├── styles/               # Global CSS
│   ├── routes.tsx            # Page routing
│   └── main.tsx              # App entry point
├── .env                      # Secret keys (not in GitHub)
├── .gitignore
├── package.json
├── vite.config.ts
└── docs/
    ├── product.md            # This file's sibling
    └── technical.md          # This file
```

---

## Database (Supabase)

### Project URL
`https://uridkhpiehxdrsinakyv.supabase.co`

### Tables

#### `tasks`
| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Auto-generated primary key |
| `created_at` | timestamp | Auto-generated |
| `title` | text | The task description |
| `status` | text | `pending` / `working` / `done` / `drifted` |
| `energy` | text | `high` / `medium` / `low` |

### Allowed Values (enforced in code)
- **status:** `pending`, `working`, `done`, `drifted`
- **energy:** `high`, `medium`, `low`

---

## Deployment

Hosted on Vercel. Auto-deploys when code is pushed to `main` on GitHub.

**Vercel settings:**
- Root Directory: `Drift React`
- Build Command: `npm run build`
- Output Directory: `dist`

### Deploy process
```bash
git add .
git commit -m "your message"
git push
```
Vercel picks it up automatically. Done.

---

## Claude API Integration (Planned)

The prioritisation engine will use Claude Sonnet via the Anthropic API.

**How it works:**
1. User opens Next screen and selects energy level (High / Medium / Low)
2. App sends all `pending` tasks + energy level + Personal Context Document to Claude
3. Claude returns the single best task to work on now
4. App displays that task on the Next screen

**Personal Context Document** is stored as a system prompt — it contains the user's life priorities, weekly rhythm, and working style.

---

## Key Technical Decisions

| Decision | Reasoning |
|----------|-----------|
| Vite over CRA | Faster, lighter, modern standard |
| TypeScript | Catches errors early, better Cursor autocomplete |
| Supabase over Firebase | Postgres is more flexible, generous free tier |
| `.env` for secrets | Keys never touch GitHub |
| Text not enum in DB | Easier to iterate while schema is evolving |
