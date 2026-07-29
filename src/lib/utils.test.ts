import { describe, it, expect } from "vitest";
import { formatDuration, categoryColor } from "./utils";

describe("formatDuration", () => {
  it("formats seconds as m:ss", () => {
    expect(formatDuration(90)).toBe("1:30");
    expect(formatDuration(5)).toBe("0:05");
  });

  it("returns placeholder for zero or invalid duration", () => {
    expect(formatDuration(0)).toBe("--:--");
  });
});

describe("categoryColor", () => {
  it("maps known categories to their brand color", () => {
    expect(categoryColor("cm")).toBe("sun");
    expect(categoryColor("movie")).toBe("black");
    expect(categoryColor("artist")).toBe("magenta");
    expect(categoryColor("tourism")).toBe("teal");
  });

  it("falls back to teal for unknown categories", () => {
    expect(categoryColor("unknown-category")).toBe("teal");
  });
});
