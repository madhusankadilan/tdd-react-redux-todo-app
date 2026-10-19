import {
   createEntityAdapter,
   createSlice,
   type EntityState,
} from "@reduxjs/toolkit";

/** The workflow a task moves through (PRD §6, data model). */
export type TaskStatus = "todo" | "in-progress" | "done";

/** A single task (PRD §6, data model). */
export type Task = {
   id: string;
   title: string;
   description: string;
   status: TaskStatus;
   /** ISO 8601 timestamp. */
   createdAt: string;
   createdBy: string;
};

const tasksAdapter = createEntityAdapter<Task>();

export type TasksState = EntityState<Task, string>;

const initialState: TasksState = tasksAdapter.getInitialState();

const tasksSlice = createSlice({
   name: "tasks",
   initialState,
   // Actions are added in TDD-22.
   reducers: {},
});

export default tasksSlice.reducer;
