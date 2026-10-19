import { cleanup, render, type RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { PropsWithChildren, ReactElement } from "react";
import { Provider } from "react-redux";
import { afterEach } from "vitest";
import { setupStore, type AppStore, type RootState } from "../store/store";

afterEach(() => {
   cleanup();
});

function customRender(ui: ReactElement, options = {}) {
   return render(ui, {
      // wrap provider(s) here if needed
      wrapper: ({ children }) => children,
      ...options,
   });
}

type ExtendedRenderOptions = Omit<RenderOptions, "queries" | "wrapper"> & {
   /** State to start the fresh store from. Ignored when `store` is given. */
   preloadedState?: Partial<RootState>;
   /** Use this store instead of creating a fresh one. */
   store?: AppStore;
};

/**
 * Renders `ui` inside a Redux `<Provider>`. Every call gets a fresh store
 * (unless one is passed in), so tests never share state.
 */
export function renderWithProviders(
   ui: ReactElement,
   {
      preloadedState,
      store = setupStore(preloadedState),
      ...renderOptions
   }: ExtendedRenderOptions = {},
) {
   function Wrapper({ children }: PropsWithChildren) {
      return <Provider store={store}>{children}</Provider>;
   }

   return {
      store,
      user: userEvent.setup(),
      ...render(ui, { wrapper: Wrapper, ...renderOptions }),
   };
}

export * from "@testing-library/react";
export {
   afterAll,
   afterEach,
   beforeAll,
   beforeEach,
   describe,
   expect,
   it,
   test,
   vi,
} from "vitest";
export { userEvent };
// override render export
export { customRender as render };
