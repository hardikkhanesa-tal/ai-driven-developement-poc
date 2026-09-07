---
marp: true
theme: default
paginate: true
---

# AI-Assisted Dev Workflow
## Claude Skills + MCP in Practice

Superpowers · OpenSpec · Graphify · Context7 · Jira MCP

*20 min · dev team*

---

## Agenda

1. Problem: repetitive manual dev overhead
2. Claude Skills — what/how
3. Superpowers — process discipline
4. OpenSpec — spec-driven changes
5. Graphify — codebase knowledge graph (**live demo**)
6. MCP — Context7 + Jira (**live demo**)
7. Recap + Q&A

---

## The Problem

- Same manual steps every feature: brainstorm → plan → code → review → merge
- Context lost between sessions (design docs, Jira tickets, prior decisions)
- No persistent map of "what connects to what" in a codebase
- Docs/library lookups eat time, often stale in memory

**Goal:** offload repeatable process + context-fetching to tooling, keep judgment calls human.

---

## What's a Claude Skill?

- Packaged instructions (`SKILL.md`) triggered by keyword/command
- Claude reads it, follows it **before** improvising
- Lives in `~/.claude/skills/` (personal) or `.claude/skills/` (project)
- This project's `CLAUDE.md` **overrides** default skill behavior per-project

```
User: /graphify
→ Claude loads SKILL.md → follows exact steps → returns result
```

---

## Superpowers — Process Skills

Enforces a disciplined dev loop instead of ad-hoc coding:

```
brainstorming → deploy-checklist* → git-worktree
   → writing-plans → subagent-driven-development
   → TDD (red-green-refactor) → code-review
   → finish-branch (merge/PR)
```
*\*deploy-checklist = our project's custom addition*

**Key idea:** design and deployment thinking happen *before* code, not after.

---

## Superpowers — Project Customization

Our `CLAUDE.md` overrides two defaults:

- **brainstorming** → batch 4-5 questions at once (not one-at-a-time)
- **deploy-checklist** (new) → forces a `## Deployment Considerations`
  section in every design doc, before planning starts

> CLAUDE.md > skills > default behavior — always.

---

## OpenSpec — Spec-Driven Changes

Change lifecycle as explicit artifacts, not just chat history:

```
explore → propose → apply → archive
              ↕ sync
```

- `proposal.md` — what & why
- `design.md` — architecture + rationale
- `specs/*/spec.md` — delta specs per capability
- `tasks.md` — implementation checklist

Example in repo: `openspec/changes/user-specific-task-feature/`

---

## OpenSpec — why it matters

- Design decisions are **written down**, not lost in chat
- Reviewable *before* code exists
- `tasks.md` becomes the execution checklist for `openspec-apply-change`
- Graphify picked this up automatically — flagged rationale nodes for
  4 design decisions in this change

---

## 🔴 LIVE DEMO — OpenSpec

> Switch to terminal

```
/openspec-explore  or  cat openspec/changes/*/proposal.md
```
Show: proposal → design → delta specs → tasks, one real change end-to-end.

---

## Graphify — Codebase as Knowledge Graph

- Turns any folder (code + docs) into nodes/edges — persistent, queryable
- Every edge tagged **EXTRACTED** (explicit) / **INFERRED** (reasoned) /
  **AMBIGUOUS** (uncertain) — honest audit trail, nothing invented silently
- Runs AST extraction (free, deterministic) + LLM semantic extraction (parallel subagents)
- Output: `graph.html` (interactive), `GRAPH_REPORT.md`, `graph.json`

---

## Graphify — what we found in *this* repo

Ran on this project: **167 nodes, 243 edges, 22 communities**

- **God node:** `compilerOptions` (touches 16 other nodes)
- **Surprising link:** `LocalStorageMock` (test) ↔ `loadState()`/`saveState()`
  (real persistence logic) — INFERRED, not an import
- **Cross-doc link:** old todo-app design ↔ new per-profile OpenSpec change

---

## 🔴 LIVE DEMO — Graphify

> Switch to terminal / browser

```
open graphify-out/graph.html
/graphify query "how does storage state persist across reloads?"
```
Show: interactive graph, then trace one bridge-node question live.

---

## MCP — Model Context Protocol

- Standard way for Claude to call **external tools/services** directly
- No copy-pasting between Jira/Confluence/docs and chat
- Declared per-project in `.mcp.json` (checked into this repo) or globally
- Today: **Context7** (live library docs) + **Atlassian** (Jira/Confluence)

```json
{ "mcpServers": {
    "context7":  { "type": "http", "url": "https://mcp.context7.com/mcp" },
    "atlassian": { "type": "http", "url": "https://mcp.atlassian.com/v1/mcp" }
}}
```

---

## Context7 MCP — Live Docs, Not Memory

- Resolves library name → ID → fetches **current** API docs/snippets
- Used automatically for React/Vite/Tailwind/etc. questions in this repo
- Avoids stale training-data answers on fast-moving libraries

## 🔴 LIVE DEMO
```
"how do I configure vitest coverage thresholds?" → context7 auto-triggers
```

---

## Jira MCP — Ticket Context in Chat

- `/jira DL-123` or bare ticket mention → fetches full ticket: description,
  comments, status, linked issues
- Powers `/standup` (worklog + Jira → yesterday/today/blockers)
- Powers `/release-notes` (fixVersion → Confluence release page, auto-published)

## 🔴 LIVE DEMO
```
/jira <real-ticket-id>
```
Show: ticket pulled into context without leaving the editor.

---

## Recap — How It Fits Together

```
 Jira/Context7 (MCP)  →  live context, no copy-paste
        ↓
 Superpowers          →  brainstorm → plan → TDD → review
        ↓
 OpenSpec             →  written specs/rationale per change
        ↓
 Graphify             →  persistent map of what connects to what
```

Each tool removes one category of manual, error-prone busywork.

---

## Q&A

- Repo: `.mcp.json`, `CLAUDE.md`, `openspec/`, `graphify-out/`
- Skills live in `~/.claude/skills/` — inspect any `SKILL.md` directly
- Try it: `/graphify`, `/jira <ticket>`, `/openspec-explore`

**Thanks!**
