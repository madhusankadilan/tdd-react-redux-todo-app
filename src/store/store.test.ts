import { describe, expect, it } from "vitest";
import type { Task } from "../features/tasks";
import { setupStore, type RootState } from "./store";

const task: Task = {
   id: "task-1",
   title: "Write the first test",
   description: "",
   status: "todo",
   createdAt: "2026-10-19T09:00:00.000Z",
   createdBy: "Jane",
};

const preloadedState: RootState = {
   tasks: { ids: [task.id], entities: { [task.id]: task } },
};

describe("setupStore", () => {
   describe("Initial state", () => {
      it("starts from the root reducer's initial state", () => {
         const store = setupStore();

         expect(store.getState()).toEqual({
            tasks: { ids: [], entities: {} },
         });
      });

      it("starts from the preloaded state when one is given", () => {
         const store = setupStore(preloadedState);

         expect(store.getState()).toEqual(preloadedState);
      });
   });

   describe("Isolation", () => {
      it("returns a new, independent store on every call", () => {
         const first = setupStore(preloadedState);
         const second = setupStore();

         expect(first).not.toBe(second);
         expect(first.getState().tasks.ids).toEqual([task.id]);
         expect(second.getState().tasks.ids).toEqual([]);
      });
   });
});
