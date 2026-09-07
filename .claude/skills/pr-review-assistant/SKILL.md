---
name: pr-review-assistant
description: >
  Review a pull request for correctness bugs, security issues, performance problems,
  and maintainability. Fetches the diff, runs risk detection, applies a structured
  checklist, and outputs ranked findings. Trigger: /pr-review, "review this PR",
  "check PR", "audit diff", or any GitHub PR URL in the prompt.
triggers:
  - /pr-review
  - review this PR
  - check PR
  - audit diff
---

# PR Review Assistant

Invoked when the user shares a GitHub PR URL or asks to review a diff.
Produces a structured, ranked finding report — no formatting nits, no hallucinated issues.

---

## Constraints (non-negotiable)

1. **No formatting nitpicks** — never flag whitespace, indentation, naming conventions, or style. Flag logic, safety, and correctness only.
2. **Production risk first** — rank by blast radius (data loss > security breach > outage > silent corruption > performance > debt). Low-risk suggestions go last or are omitted.
3. **WHY is mandatory** — every finding must state the failure mode it enables, not just describe the code. "Missing null check" is not a finding. "Missing null check on `user.id` — crashes the request handler if unauthenticated users reach this endpoint" is.
4. **Evidence-only** — report only what is directly visible in the diff. Do not infer bugs that are not demonstrated by the changed lines. If uncertain, omit.

---

## Step 1 — Fetch the diff

If given a GitHub PR URL, retrieve the raw diff via the GitHub API:

```bash
gh pr diff <PR_NUMBER> --repo <owner/repo>
```

If `gh` is unavailable, use:

```bash
curl -L -H "Accept: application/vnd.github.v3.diff" <PR_URL>.diff
```

Save the raw diff to the scratchpad for use in subsequent steps.

---

## Step 2 — Run the risk detection script

```bash
python3 scripts/detect_risky_patterns.py <path-to-diff-file>
```

Parse all flagged lines from the output. Every flag is evidence — include it in findings.
**Do not skip this step.**

---

## Step 3 — Apply the review checklist

Read `references/review-checklist.md`. Systematically check each section:

- **Security** — injection, auth, secrets, input validation
- **Performance** — N+1 queries, unbounded loops, missing indexes
- **Maintainability** — error handling, test coverage, dead code

Cross-reference checklist findings with script output. Deduplicate overlapping findings.

---

## Step 4 — Categorize findings

| Category | Criteria |
|---|---|
| **CRITICAL** | Data loss, security breach, outage, or silent corruption in production |
| **WARNING** | Likely bugs, degraded performance, or compounding technical debt |
| **SUGGESTION** | Reduces risk or improves clarity; no urgent production impact |

Rules:
- Every finding **must** cite file and line number (when available)
- Every finding **must** explain WHY it matters, not just what it is
- Do **not** flag formatting style, naming conventions, or whitespace
- Do **not** hallucinate — only report what is directly visible in the diff
- Rank by production blast radius

---

## Step 5 — Output the review

```
## PR Review: <PR title or URL>

### CRITICAL
- [file:line] **Issue title** — Why this is dangerous and what failure mode it enables.

### WARNINGS
- [file:line] **Issue title** — Why this matters and what could go wrong.

### SUGGESTIONS
- [file:line] **Issue title** — Why this would improve the code.

### Summary
<2–3 sentences: overall risk level and the single most important fix needed>
```

If a section has no findings, write `None found.`

---

## References

- Checklist: `references/review-checklist.md`
- Risk script: `scripts/detect_risky_patterns.py`
