## ADDED Requirements

### Requirement: Board view renders todos grouped by status
The system SHALL render, when board view is active, three columns labeled "To Do", "In Progress", and "Done", each containing exactly the currently-visible todos (after existing filter/search/sort) whose `status` matches that column.

#### Scenario: Todos appear in the matching column
- **WHEN** the visible todo list contains items with `status` values `todo`, `in-progress`, and `done`
- **THEN** each item renders under the column matching its `status` and under no other column

#### Scenario: Empty column renders without error
- **WHEN** no visible todo has a given `status`
- **THEN** that column renders empty (no crash, no placeholder todo)

### Requirement: View toggle switches between List and Board
The system SHALL provide a control to switch between List view and Board view, and SHALL preserve the active filter, search, and sort settings when switching.

#### Scenario: Switching to Board keeps filters applied
- **WHEN** a user has an active filter/search/sort and switches from List to Board view
- **THEN** the Board shows the same filtered/sorted set of todos the List was showing, grouped by status

#### Scenario: Switching back to List
- **WHEN** a user switches from Board view back to List view
- **THEN** the List renders the same visible todos, unaffected by having been viewed as a board

### Requirement: Moving a card updates todo status
The system SHALL let a user move a todo card from one column to another, dispatching the existing `setStatus` action with the target column's status.

#### Scenario: Drag-and-drop move
- **WHEN** a user drags a card from the "To Do" column and drops it on the "In Progress" column
- **THEN** the todo's `status` becomes `in-progress` and the card renders in the "In Progress" column

#### Scenario: Non-drag move fallback
- **WHEN** a user activates the move control on a card without using drag-and-drop (e.g. keyboard or button)
- **THEN** the user can select a target column and the todo's `status` updates to match, identically to a drag-and-drop move

#### Scenario: done mirrors status as it already does
- **WHEN** a card is moved to the "Done" column
- **THEN** the todo's `done` field becomes `true`, consistent with existing `setStatus` reducer behavior
