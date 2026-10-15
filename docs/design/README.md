# Design

PNG exports of the TDD Todo App's design system and UI screens.

- **Source of truth:** the Penpot file **"Design System"** (pages *Foundations*, *Components*, *App Screens*). These PNGs are snapshots and can fall behind the Penpot file. Re-export them when the design changes.
- **Related:** [PRD](../product/PRD.md) (user stories referenced below) · [ADR-0008: list + drawer UX](../architecture/adr/0008-list-and-drawer-ux.md) · [ADR-0007: Penpot](../architecture/adr/0007-penpot-as-design-tool.md)
- **Penpot source file:** [`design-system.penpot`](design-system.penpot) is a full snapshot of the Penpot file (foundations, components, tokens, screens, notes, and the archived Option A). To open it, go to Penpot → *Projects → Import Penpot files*. Re-export it at design milestones, not after every edit.
- **Last exported:** 2026-10-15

## Foundations

Colors (including status colors), typography (Plus Jakarta Sans), spacing and radius. These are mirrored by the token set `core`.

![Foundations](images/foundations.png)

## Components

| Component | Variants | Preview |
|---|---|---|
| Button | Primary / Secondary / Danger / Danger link × Small / Medium | ![Button](images/component-button.png) |
| Checkbox | Checked: False / True | ![Checkbox](images/component-checkbox.png) |
| Status Pill | To do / In progress / Done | ![Status Pill](images/component-status-pill.png) |
| Filter Pill | Default / Selected | ![Filter Pill](images/component-filter-pill.png) |
| Snackbar | Success / Error | ![Snackbar](images/component-snackbar.png) |
| Status Picker | To do / In progress / Done | ![Status Picker](images/component-status-picker.png) |
| Status Menu | To do / In progress / Done | ![Status Menu](images/component-status-menu.png) |
| Row Actions Menu | — | ![Row Actions Menu](images/component-row-actions-menu.png) |
| Confirm Dialog | — | ![Confirm Dialog](images/component-confirm-dialog.png) |
| Add Task Bar | — | ![Add Task Bar](images/component-add-task-bar.png) |
| Task Row | Selected × Completed | ![Task Row](images/component-task-row.png) |
| Empty State | All / To do / In progress / Done | ![Empty State](images/component-empty-state.png) |
| Annotation *(docs only)* | Note / Decision | ![Annotation](images/component-annotation.png) |

## App screens

All screens are 1440×900. In Penpot, each screen has notes next to it explaining its interactions and decisions.

### Core flows

**01 · Task list (US-3).** "My tasks" with the add bar, filter pills with counts, and task rows in all three statuses.

![01 Task list](images/screen-01-task-list.png)

**02 · Task details drawer (US-9, US-10).** Clicking a row opens the drawer with a status picker, the description, "Delete task" and "Close".

![02 Task details drawer](images/screen-02-task-details-drawer.png)

**03 · Change status from the list (US-6).** The row's status pill opens the status menu.

![03 Change status from the list](images/screen-03-change-status-from-list.png)

**04 · Delete confirmation dialog (US-11).** Deleting always asks first.

![04 Delete confirmation dialog](images/screen-04-delete-confirmation-dialog.png)

**13 · Row actions menu ⋯ (US-14).** "Open details" and "Delete".

![13 Row actions menu](images/screen-13-row-actions-menu.png)

### Results: success and failure

| | Success | Failure |
|---|---|---|
| **Add** (US-1, US-2) | **05:** task added at the top, no Undo<br>![05](images/screen-05-add-task-success.png) | **06:** the typed text is kept, Retry<br>![06](images/screen-06-add-task-failed.png) |
| **Change status** (US-8) | **07:** moved to Done, with **Undo**<br>![07](images/screen-07-status-change-success.png) | **08:** keeps the old status, Retry<br>![08](images/screen-08-status-change-failed.png) |
| **Delete** (US-12) | **09:** task removed, no Undo<br>![09](images/screen-09-delete-success.png) | **10:** task stays in the list, Retry<br>![10](images/screen-10-delete-failed.png) |

### Filters and empty states (US-4, US-5)

| | |
|---|---|
| **11 · Filtered: In progress**<br>![11](images/screen-11-filtered-in-progress.png) | **12 · Empty: In progress**<br>![12](images/screen-12-empty-state-in-progress.png) |
| **14 · Empty: first run (All)**<br>![14](images/screen-14-empty-state-first-run.png) | **15 · Empty: To do**<br>![15](images/screen-15-empty-state-to-do.png) |
| **16 · Empty: Done**<br>![16](images/screen-16-empty-state-done.png) | |
