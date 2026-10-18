import { describe, expect, it } from "vitest";
import { getClassNames } from "./css";

describe("getClassNames", () => {
   describe("Base class", () => {
      it("prefixes the base class with dc-", () => {
         expect(getClassNames("button", [])).toBe("dc-button");
      });
   });

   describe("Modifiers", () => {
      it("adds a dc-<base>-<modifier> class for each modifier, in order", () => {
         expect(getClassNames("button", ["contained-primary", "medium"])).toBe(
            "dc-button dc-button-contained-primary dc-button-medium",
         );
      });
   });

   describe("Custom classes", () => {
      it("appends custom classes after the generated ones, unprefixed", () => {
         expect(getClassNames("button", ["small"], "my-button wide")).toBe(
            "dc-button dc-button-small my-button wide",
         );
      });

      it("leaves no trailing whitespace when custom classes are empty", () => {
         expect(getClassNames("button", ["small"], "")).toBe(
            "dc-button dc-button-small",
         );
      });

      it("leaves no trailing whitespace when custom classes are omitted", () => {
         expect(getClassNames("button", ["small"])).toBe(
            "dc-button dc-button-small",
         );
      });
   });
});
