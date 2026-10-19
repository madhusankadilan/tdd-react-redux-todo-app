import type { Task } from "../features/tasks";
import { useAppSelector } from "../store/hooks";
import { setupStore } from "../store/store";
import {
   describe,
   expect,
   it,
   renderWithProviders,
   screen,
} from "./test-utils";

function TaskCount() {
   const count = useAppSelector((state) => state.tasks.ids.length);
   return <p>{count} tasks</p>;
}

const task: Task = {
   id: "task-1",
   title: "Write the first test",
   description: "",
   status: "todo",
   createdAt: "2026-10-19T09:00:00.000Z",
   createdBy: "Jane",
};

describe("renderWithProviders", () => {
   describe("Initial Render", () => {
      it("renders a component that reads the preloaded state from the store", () => {
         renderWithProviders(<TaskCount />, {
            preloadedState: {
               tasks: { ids: [task.id], entities: { [task.id]: task } },
            },
         });

         expect(screen.getByText("1 tasks")).toBeInTheDocument();
      });

      it("returns the store and a user-event instance with the render result", () => {
         const { store, user, container } = renderWithProviders(<TaskCount />);

         expect(store.getState().tasks.ids).toEqual([]);
         expect(user.click).toBeTypeOf("function");
         expect(container).toBeInTheDocument();
      });

      it("uses the store passed in instead of creating one", () => {
         const store = setupStore({
            tasks: { ids: [task.id], entities: { [task.id]: task } },
         });

         const result = renderWithProviders(<TaskCount />, { store });

         expect(result.store).toBe(store);
         expect(screen.getByText("1 tasks")).toBeInTheDocument();
      });
   });

   describe("Isolation", () => {
      // These two run in order: the first preloads a task, the second must not see it.
      it("uses the preloaded task in this test", () => {
         const { store } = renderWithProviders(<TaskCount />, {
            preloadedState: {
               tasks: { ids: [task.id], entities: { [task.id]: task } },
            },
         });

         expect(store.getState().tasks.ids).toEqual([task.id]);
      });

      it("starts the next test with a fresh, empty store", () => {
         renderWithProviders(<TaskCount />);

         expect(screen.getByText("0 tasks")).toBeInTheDocument();
      });
   });
});
