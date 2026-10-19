import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { tasksReducer } from "../features/tasks";

const rootReducer = combineReducers({
   tasks: tasksReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

/**
 * Creates a new store. Call it once for the app, and once per test so tests
 * never share state.
 */
export function setupStore(preloadedState?: Partial<RootState>) {
   return configureStore({
      reducer: rootReducer,
      preloadedState,
   });
}

export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
