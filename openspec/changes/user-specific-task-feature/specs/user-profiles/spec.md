## ADDED Requirements

### Requirement: Profile creation
The system SHALL allow the user to create a new named profile by entering a name, with no password or credential required.

#### Scenario: Create first profile
- **WHEN** no profiles exist and the user enters a name and confirms
- **THEN** a new profile is created with that name and set as the active profile

#### Scenario: Create additional profile
- **WHEN** at least one profile already exists and the user enters a new name and confirms
- **THEN** a new profile is added to the registry without altering other profiles' task data

#### Scenario: Duplicate profile names allowed
- **WHEN** the user enters a name matching an existing profile's name
- **THEN** the system creates a distinct new profile (unique id) rather than rejecting or merging

### Requirement: Profile listing and switching
The system SHALL show all existing profiles in a picker and let the user switch the active profile.

#### Scenario: List profiles
- **WHEN** the profile picker is opened
- **THEN** it displays the name of every profile in the registry

#### Scenario: Switch active profile
- **WHEN** the user selects a different profile from the picker
- **THEN** the active profile changes and the task list, filter, search, sort, and theme shown reflect that profile's own state

### Requirement: Profile persistence across sessions
The system SHALL persist the profile registry and the active profile selection across page reloads.

#### Scenario: Reload retains active profile
- **WHEN** the user reloads the app after switching to a profile
- **THEN** the same profile is active and its task list is shown, without requiring the user to reselect it

### Requirement: Legacy data migration to default profile
The system SHALL migrate any pre-existing single-user task data into a default profile the first time the app loads after this feature ships, without data loss.

#### Scenario: First load with legacy data and no registry
- **WHEN** the app loads, no profile registry exists yet, and legacy single-user task data is present
- **THEN** the system creates one profile containing that legacy data, sets it active, and the user sees their existing tasks unchanged

#### Scenario: First load with no legacy data and no registry
- **WHEN** the app loads, no profile registry exists yet, and no legacy task data is present
- **THEN** the system creates one empty default profile and sets it active
