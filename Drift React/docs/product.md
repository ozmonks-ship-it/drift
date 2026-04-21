# Drift — Product Document

> *Just drift through life. Easy.*

## What is Drift?

Drift is a task app for people with high cognitive overload — people who want to do everything but don't have enough time, get easily distracted, and stress about long todo lists they'll never finish.

Most todo apps are just backlogs. They show you everything, expect you to prioritise, and leave you overwhelmed. Drift is different. **Drift picks one thing for you. You just show up and do it.**

---

## Target User

People like the founder — high cognitive load, full life, easily distracted, morning person, short focus sprints. Parents, creative professionals, busy people who want to feel calm and in control rather than buried.

---

## Core Insight

> "I don't need a list. I need someone to tell me what to do next."

The stress isn't the tasks themselves — it's the decision fatigue of choosing between them. Drift removes that decision entirely.

---

## The Three Things Drift Does (v1)

### 1. Capture
Frictionless task entry. Just type what's on your mind. No categories, no tags, no effort required. The goal is to get it out of your head and into Drift as fast as possible.

### 2. The Pick
Drift picks one task for you based on your personal context and current energy. You don't see your list. You see one thing. That's it.

### 3. Done or Drift
When you finish — mark it Done (small celebration moment). If now isn't the right time — let it Drift. No guilt, no backlog anxiety. It'll come back around when the time is right. Or Bin it entirely.

---

## User Flow

```
Home → Add task → Next (Drift picks one) → Working → Done ✓
                                          ↘ Drift ~
                                          ↘ Bin ×
```

- **Home** — calm entry point, nothing in your face. Two actions: What's next? / Add task.
- **Add** — "What's on your mind?" Free text, no friction.
- **Next** — one task shown. UP NEXT label. Start → Working. Drift → back to Home. Bin → deleted.
- **Working** — task front and centre, timer running. Done or Drift.
- **Done** — tick animation, celebration moment, back to Home.

**Session persistence:** If a user is mid-task and leaves the app, they return to the Working screen — not Home.

---

## Prioritisation Logic

Drift picks the next task using two inputs:

1. **Personal Context** — the user's life priorities (family, exercise, reading, work etc.)
2. **Current Energy** — High 🔋 / Medium 🔆 / Low 🪫

High energy → tackle important, heavy tasks
Low energy → gentle, easy tasks that still move things forward

The pick is made by the Claude API using the user's Personal Context Document as a system prompt.

---

## What Drift is NOT

- Not a project manager
- Not a calendar
- Not a team tool
- Not another backlog
- Not a habit tracker

Every feature request gets measured against the core: **does this help someone do the one right thing right now?** If not, it's out.

---

## Design Principles

- **Calm over busy** — dark, minimal, generous whitespace
- **One thing at a time** — never show the list
- **No guilt** — Drift and Bin exist so nothing feels permanent or precious
- **Micro-moments matter** — Done should feel good. Drift should feel like release.
- **Mobile first** — designed as a phone experience

---

## Roadmap

| Phase | Focus |
|-------|-------|
| v1 (now) | Core flow live, Supabase persistence, Claude API prioritisation |
| v2 | User accounts, cross-device sync, PWA (installable on phone) |
| v3 | Onboarding, personal context setup in-app, sharing/referrals |

---

## Key Decisions Log

| Decision | Reasoning |
|----------|-----------|
| Web app first, not native | Faster to build, no app store, works on any device |
| No effort tagging by user | Too much friction — Claude infers from context |
| Text over enum in DB | Easier to iterate while product is still evolving |
| No list view | Showing the list defeats the entire purpose of Drift |
| Bin added to Next screen | Sometimes you don't want to drift — you want it gone |
