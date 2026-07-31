## Context

Todo app is client-only React + localStorage. Single global key `todo-app-state` holds one `AppState` (todos, filter, search, sort, theme). `useTodos()` loads/saves that key via `loadState`/`saveState`. No auth, no backend — this stays true after the change; profiles are a local convenience, not accounts.

## Goals / Non-Goals

**Goals:**
- Support multiple named profiles on one device/browser, each with its own todos/filter/search/sort/theme.
- Preserve existing single-user data by migrating it into a default profile on first load after upgrade.
- Keep everything client-side; no new runtime dependency.

**Non-Goals:**
- No authentication, passwords, or access control — any profile is one click away, not a security boundary.
- No cross-device sync.
- No per-profile permissions or sharing of tasks between profiles.

## Decisions

- **Profile registry key**: new localStorage key `todo-app-profiles` storing `{ profiles: {id, name}[], activeProfileId: string }`. Rationale: keeps profile metadata separate from per-profile task data so listing/switching profiles doesn't require loading every profile's full state. Alternative considered: embed profile list inside each profile's state blob — rejected, would require scanning all keys to build the picker.
- **Per-profile state key**: `todo-app-state:<profileId>` (existing `AppState` shape, unchanged). Rationale: minimal change to `storage.ts` — `loadState`/`saveState` take a `profileId` param and interpolate the key; `AppState` type and reducer untouched.
- **Migration**: on first read, if `todo-app-profiles` is missing but legacy `todo-app-state` exists, create one profile (name "My Tasks", generated id), copy legacy data to `todo-app-state:<id>`, set it active, and leave the old key in place (not deleted) as a safety net. Rationale: zero data loss, reversible; cheap enough to leave stale key rather than add delete-then-fail risk.
- **Profile id generation**: `crypto.randomUUID()` (available in all supported browsers for this Vite/React 19 app). Alternative: incrementing counter — rejected, counter needs a source of truth that duplicates registry state.
- **Switching profiles**: changing `activeProfileId` in the registry triggers `useTodos()` to reload state from the new profile's key. Implemented by keying `useReducer`'s init call off `activeProfileId` (React remounts reducer state via a `key` prop on a wrapper, or an effect that dispatches a full-state replace action) — exact mechanism left to implementation, but must not require a full page reload.
- **New hook**: `useProfiles()` owns the registry (list, create, switch), separate from `useTodos()` which continues to own task state for whichever profile is active. Rationale: matches existing separation of concerns (one hook per state slice) already used in the codebase.

## Risks / Trade-offs

- [Two localStorage keys read on every load (registry + active profile state)] → negligible perf cost at localStorage scale; acceptable.
- [Migration runs on every load until legacy key is manually cleared] → guard migration with a check for `todo-app-profiles` existing first, so it only executes once per browser.
- [No collision-proof profile names] → allow duplicate names (ids are what's authoritative); picker shows name, not id.
- [localStorage cleared by user wipes all profiles] → same risk as current single-user app; not a regression, out of scope to fix.

## Migration Plan

1. Ship `useProfiles()` + updated `storage.ts` behind no flag (localStorage-only change, safe to ship directly).
2. On app load: run migration check once, then render profile picker + existing todo UI scoped to active profile.
3. Rollback: revert commit; legacy `todo-app-state` key is left untouched by migration, so reverting restores prior behavior with no data loss (per-profile keys become orphaned but harmless).

## Open Questions

- None blocking — profile deletion/rename are natural follow-ups but out of scope for this change (create + switch only, per brainstorming answers).
