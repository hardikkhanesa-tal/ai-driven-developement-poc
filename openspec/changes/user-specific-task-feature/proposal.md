## Why

App has one shared task list on a device. Multiple people (family, roommates) using same browser get mixed tasks, no way to keep own list separate.

## What Changes

- Add lightweight named user profiles (no password) — pick from a picker, create new by typing a name.
- Task storage keyed per active profile — tasks, filters, and theme namespaced by user id.
- Profile switcher UI in app shell (alongside theme toggle).
- Existing single shared task list migrates to a default profile on first load (no data loss).

## Capabilities

### New Capabilities
- `user-profiles`: create/select/switch named user profiles, persisted in localStorage, no auth.

### Modified Capabilities
- `todo-storage`: storage keys become namespaced per active profile id instead of one global key.

## Impact

- `src/logic/storage.ts` — key scheme changes to include profile id; migration path for existing single-user data.
- `src/hooks/useTodos.ts` — reload/reinitialize when active profile changes.
- `src/App.tsx` — mount profile picker, track active profile in app state.
- New component: profile picker/switcher UI.
- No backend, no new dependencies.
