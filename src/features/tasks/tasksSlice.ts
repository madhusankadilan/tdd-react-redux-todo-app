import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

export type Task = {
   id: string;
   title: string;
};

export type TasksState = {
   items: Task[];
};

const initialState: TasksState = {
   items: [],
};

const tasksSlice = createSlice({
   name: "tasks",
   initialState,
   reducers: {
      taskAdded: {
         reducer(state, action: PayloadAction<Task>) {
            state.items.push(action.payload);
         },
         // Builds the payload outside the reducer, so the reducer stays pure
         prepare(title: string) {
            return { payload: { id: nanoid(), title } };
         },
      },
   },
});

export const { taskAdded } = tasksSlice.actions;

export const selectTasks = (state: RootState) => state.tasks.items;

export default tasksSlice.reducer;
