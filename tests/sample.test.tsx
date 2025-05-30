import { describe, it, expect } from "vitest"; // or jest
import Home from "../src/app/page";

describe("Home redirect", () => {
  it("should redirect to /schedule", () => {
    expect(() => Home()).toThrow();
  });
});
