# Graph Report - .  (2026-08-03)

## Corpus Check
- Corpus is ~20,822 words - fits in a single context window. You may not need a graph.

## Summary
- 167 nodes · 243 edges · 22 communities (16 shown, 6 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.82)
- Token cost: 200,000 input · 52,414 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Package Config & Dependencies|Package Config & Dependencies]]
- [[_COMMUNITY_App Shell & Date Status|App Shell & Date Status]]
- [[_COMMUNITY_Todo State & Persistence Logic|Todo State & Persistence Logic]]
- [[_COMMUNITY_OpenSpec User-Profile Change|OpenSpec User-Profile Change]]
- [[_COMMUNITY_TypeScript Compiler Config|TypeScript Compiler Config]]
- [[_COMMUNITY_Todo UI & Sorting Types|Todo UI & Sorting Types]]
- [[_COMMUNITY_Project Workflow & Design Docs|Project Workflow & Design Docs]]
- [[_COMMUNITY_Test LocalStorage Mock|Test LocalStorage Mock]]
- [[_COMMUNITY_OpenSpec Slash Commands|OpenSpec Slash Commands]]
- [[_COMMUNITY_TodoItem Inline Edit|TodoItem Inline Edit]]
- [[_COMMUNITY_Build Tooling Concepts|Build Tooling Concepts]]
- [[_COMMUNITY_MCP Servers|MCP Servers]]
- [[_COMMUNITY_MCP Config Entries|MCP Config Entries]]
- [[_COMMUNITY_Local Settings & Plan Doc|Local Settings & Plan Doc]]
- [[_COMMUNITY_Remember Tmp State|Remember Tmp State]]
- [[_COMMUNITY_Filter Test Suite|Filter Test Suite]]
- [[_COMMUNITY_Sort Test Suite|Sort Test Suite]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `LocalStorageMock` - 9 edges
3. `App()` - 8 edges
4. `Todo` - 8 edges
5. `TodoItem()` - 7 edges
6. `dateStatus()` - 7 edges
7. `useTodos()` - 6 edges
8. `user-specific-task-feature Design Doc` - 6 edges
9. `scripts` - 5 edges
10. `sortTodos()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Three-Layer Architecture (logic/state/UI)` --semantically_similar_to--> `Per-Profile State Key Decision (todo-app-state:<profileId>)`  [INFERRED] [semantically similar]
  docs/superpowers/specs/2026-07-06-todo-app-design.md → openspec/changes/user-specific-task-feature/design.md
- `LocalStorageMock` --shares_data_with--> `loadState()`  [INFERRED]
  vitest.setup.ts → src/logic/storage.ts
- `LocalStorageMock` --shares_data_with--> `saveState()`  [INFERRED]
  vitest.setup.ts → src/logic/storage.ts
- `Claude Local Permission Settings` --references--> `Todo App Implementation Plan Doc`  [EXTRACTED]
  .claude/settings.local.json → docs/superpowers/plans/2026-07-06-todo-app.md
- `OpenSpec Archive Change Skill` --conceptually_related_to--> `OpenSpec Project Config`  [INFERRED]
  .claude/skills/openspec-archive-change/SKILL.md → openspec/config.yaml

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Todo Item Inline Edit Flow** — components_todoitem_todoitem, components_todoitem_commitedit, components_todoitem_canceledit, components_todoitem_handlekeydown [EXTRACTED 1.00]
- **Todo Filter/Search/Sort Data Pipeline** — hooks_usetodos_usetodos, logic_filter_filtertodos, logic_filter_searchtodos, logic_sort_sorttodos [INFERRED 0.85]
- **Todo App Root UI Composition** — src_app_app, components_todoform_todoform, components_todolist_todolist, components_searchbox_searchbox, components_filterbar_filterbar, components_themetoggle_themetoggle [EXTRACTED 1.00]
- **OpenSpec change lifecycle workflow (propose -> apply -> archive, with explore/update/sync)** — opsx_propose, opsx_apply, opsx_archive, opsx_explore, opsx_update, opsx_sync, openspec_apply_change_skill [EXTRACTED 0.90]
- **Todo app core state management (types, reducer, storage, sorting)** — logic_types_appstate, logic_types_action, logic_todoreducer_todoreducer, logic_storage_defaultstate, logic_sort_sorttodos [INFERRED 0.85]
- **OpenSpec Change Lifecycle Skill Set** — openspec_explore_skill_explore, openspec_propose_skill_propose, openspec_update_change_skill_update_change, openspec_sync_specs_skill_sync_specs, openspec_archive_change_skill_archive_change [EXTRACTED 0.95]
- **user-specific-task-feature Change Artifact Bundle** — user_specific_task_feature_proposal_doc, user_specific_task_feature_design_doc, todo_storage_spec_delta, user_profiles_spec_delta, user_specific_task_feature_tasks_doc [EXTRACTED 0.95]
- **Todo App Project Documentation Set** — plans_2026_07_06_todo_app_plan, specs_2026_07_06_todo_app_design_design, claude_md_workflow_overrides, index_todo_app_html [INFERRED 0.85]

## Communities (22 total, 6 thin omitted)

### Community 0 - "Package Config & Dependencies"
Cohesion: 0.08
Nodes (24): dependencies, react, react-dom, devDependencies, autoprefixer, jsdom, postcss, tailwindcss (+16 more)

### Community 1 - "App Shell & Date Status"
Cohesion: 0.17
Nodes (13): FilterBar(), SearchBox(), ThemeToggle(), TodoForm(), TodoInput, TodoList(), dateStatus(), Local End-of-Day Parsing Rationale (+5 more)

### Community 2 - "Todo State & Persistence Logic"
Cohesion: 0.22
Nodes (12): useTodos(), filterTodos(), searchTodos(), sortTodos(), defaultState, loadState(), saveState(), storage test suite (+4 more)

### Community 3 - "OpenSpec User-Profile Change"
Cohesion: 0.19
Nodes (19): OpenSpec Project Config, OpenSpec Archive Change Skill, Store Selection Convention, OpenSpec Explore Skill, OpenSpec Propose Skill, OpenSpec Sync Specs Skill, OpenSpec Update Change Skill, user-specific-task-feature Change Metadata (+11 more)

### Community 4 - "TypeScript Compiler Config"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 5 - "Todo UI & Sorting Types"
Cohesion: 0.18
Nodes (10): STATUSES, PRIORITY_BORDER, STATUS_BADGE, PRIORITY_RANK, todoReducer test suite, Action, Filter, SortKey (+2 more)

### Community 6 - "Project Workflow & Design Docs"
Cohesion: 0.36
Nodes (8): Brainstorming Skill (Modified: batched questions), deploy-checklist Custom Step, Project Superpowers Workflow Overrides, Todo App index.html, Todo App Implementation Plan, Three-Layer Architecture (logic/state/UI), Deployment Considerations Section, Todo App Design Spec

### Community 8 - "OpenSpec Slash Commands"
Cohesion: 0.33
Nodes (7): openspec-apply-change skill, OPSX: Apply command, OPSX: Archive command, OPSX: Explore command, OPSX: Propose command, OPSX: Sync command, OPSX: Update command

### Community 9 - "TodoItem Inline Edit"
Cohesion: 0.83
Nodes (4): cancelEdit Function, commitEdit Function, handleKeyDown Function, TodoItem()

### Community 10 - "Build Tooling Concepts"
Cohesion: 0.50
Nodes (4): Tailwind CSS, Vitest Test Runner, todo-app Package Manifest, PostCSS Configuration

### Community 12 - "MCP Config Entries"
Cohesion: 0.67
Nodes (3): MCP Servers Configuration, Atlassian MCP Server, Context7 MCP Server

## Knowledge Gaps
- **64 isolated node(s):** `context7`, `atlassian`, `name`, `private`, `version` (+59 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `LocalStorageMock` connect `Test LocalStorage Mock` to `Todo State & Persistence Logic`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `dateStatus()` connect `App Shell & Date Status` to `TodoItem Inline Edit`, `Todo UI & Sorting Types`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `loadState()` connect `Todo State & Persistence Logic` to `Test LocalStorage Mock`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `LocalStorageMock` (e.g. with `loadState()` and `saveState()`) actually correct?**
  _`LocalStorageMock` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `context7`, `atlassian`, `name` to the rest of the system?**
  _64 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Package Config & Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `TypeScript Compiler Config` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._