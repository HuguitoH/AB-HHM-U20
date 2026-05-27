import { NoDataAvailableError } from "../src/errors/NoDataAvailableError.js";

describe("NoDataAvailableError", () => {
  test("is instance of Error with correct message and name", () => {
    const error = new NoDataAvailableError("12-05-2026");
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(NoDataAvailableError);
    expect(error.name).toBe("NoDataAvailableError");
    expect(error.message).toContain("12-05-2026");
  });
});

