## 1. Profile types and registry storage

- [ ] 1.1 Write failing tests for `Profile` type + registry read/write helpers (load registry, save registry, create profile, set active profile) in `src/logic/profiles.test.ts`
- [ ] 1.2 Add `Profile` type and registry storage functions in `src/logic/profiles.ts` to make tests pass
- [ ] 1.3 Write failing tests for legacy-data migration (first load with legacy `todo-app-state` key, first load with no data)
- [ ] 1.4 Implement migration logic to make tests pass

## 2. Per-profile task storage

- [ ] 2.1 Write failing tests for `loadState(profileId)` / `saveState(profileId, state)` reading/writing `todo-app-state:<profileId>` in `src/logic/storage.test.ts`
- [ ] 2.2 Update `src/logic/storage.ts` to namespace keys by `profileId`, keeping `AppState` shape unchanged
- [ ] 2.3 Write failing test asserting saving one profile's state does not alter another profile's stored key
- [ ] 2.4 Verify isolation test passes against updated `storage.ts`

## 3. useProfiles hook

- [ ] 3.1 Write failing tests for `useProfiles()` (list profiles, create profile, switch active profile, persists across remount) in `src/hooks/useProfiles.test.ts`
- [ ] 3.2 Implement `src/hooks/useProfiles.ts` to make tests pass

## 4. Wire useTodos to active profile

- [ ] 4.1 Write failing test: `useTodos(profileId)` loads/saves state scoped to the given profile id
- [ ] 4.2 Update `src/hooks/useTodos.ts` to accept `profileId` and reload state when it changes
- [ ] 4.3 Write failing test: switching profile id updates the todos/filter/search/sort/theme returned by the hook without a full page reload
- [ ] 4.4 Implement the reload-on-switch behavior to make the test pass

## 5. Profile picker UI

- [ ] 5.1 Write failing component test for a `ProfilePicker` component (renders profile names, create-profile input, fires switch/create callbacks)
- [ ] 5.2 Implement `src/components/ProfilePicker.tsx` to make tests pass
- [ ] 5.3 Write failing test asserting `App.tsx` renders `ProfilePicker` and passes the active profile's todos to the existing todo UI
- [ ] 5.4 Wire `ProfilePicker` and `useProfiles()`/`useTodos()` together in `src/App.tsx`

## 6. Verification

- [ ] 6.1 Run full test suite (`npm test`) and confirm all pass
- [ ] 6.2 Manually verify in dev server: create two profiles, add distinct tasks to each, switch between them, reload page, confirm isolation and persistence
- [ ] 6.3 Manually verify legacy migration: seed `todo-app-state` in localStorage without a registry, load app, confirm existing tasks appear under a default profile
