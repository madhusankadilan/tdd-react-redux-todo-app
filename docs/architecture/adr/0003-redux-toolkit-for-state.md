# 0003. Redux Toolkit for state management

- **Status:** Accepted
- **Date:** 2026-10-15

## Context
The app needs shared state across the list, filters, drawer and notifications, plus undo and persistence. The project is also explicitly a React + **Redux** showcase, so state management is part of what's being demonstrated.

## Decision
We use **Redux Toolkit** with `react-redux`:
- `configureStore` behind a `setupStore(preloadedState?)` factory, so every test gets a fresh store
- `createSlice` for the `tasks` and `notifications` slices, and `createEntityAdapter` for tasks
- memoized selectors (`createSelector`) for filtered lists and counts
- typed `useAppDispatch` and `useAppSelector` hooks
- side effects (persistence) outside reducers, in a store subscriber or listener middleware

## Alternatives considered
- **Classic Redux** (hand-written action types, switch reducers): verbose and outdated. RTK is the officially recommended way to write Redux.
- **React Context + useReducer:** fine for small apps, but it lacks devtools, middleware and memoized selectors, and it doesn't meet the "Redux" goal.
- **Zustand, Jotai, MobX:** simpler APIs, but they don't match the project's stated stack.

## Consequences
- Reducers and selectors are pure functions, which makes them very easy to unit-test (the base of the test pyramid).
- Some boilerplate around store setup and typed hooks, which is acceptable and itself part of the showcase.
- Undo is implemented by keeping the previous version of the changed task in the action or notification payload.
