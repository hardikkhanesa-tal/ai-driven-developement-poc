## ADDED Requirements

### Requirement: Per-profile task storage keys
The system SHALL store each profile's task state (todos, filter, search, sort, theme) under a storage key namespaced by that profile's id, separate from other profiles' data.

#### Scenario: Save writes to active profile's key only
- **WHEN** the active profile's tasks are modified and saved
- **THEN** only that profile's storage key is updated; no other profile's stored data changes

#### Scenario: Load reads active profile's key only
- **WHEN** the app loads state for the active profile
- **THEN** it reads only that profile's storage key and does not merge data from other profiles

### Requirement: Isolation between profiles
The system SHALL ensure task data created or edited under one profile is never visible under a different profile.

#### Scenario: Task created under one profile not visible under another
- **WHEN** a task is added while profile A is active, then the user switches to profile B
- **THEN** that task does not appear in profile B's task list

#### Scenario: Independent theme and filter state per profile
- **WHEN** profile A's theme, filter, or sort settings differ from profile B's
- **THEN** switching between profiles A and B shows each profile's own theme, filter, and sort settings unchanged by the other
