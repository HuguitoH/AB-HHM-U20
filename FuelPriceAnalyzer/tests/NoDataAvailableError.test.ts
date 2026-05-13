import { NoDataAvailableError } from "../src/errors/NoDataAvailableError.js";

describe("NoDataAvailableError", () => {
  test("has correct error name", () => {
    const error = new NoDataAvailableError("12-05-2026");
    expect(error.name).toBe("NoDataAvailableError");
  });

  test("message contains the date", () => {
    const error = new NoDataAvailableError("12-05-2026");
    expect(error.message).toContain("12-05-2026");
  });

  test("message mentions API delay", () => {
    const error = new NoDataAvailableError("12-05-2026");
    expect(error.message).toContain("1-2 day delay");
  });

  test("is instance of Error", () => {
    const error = new NoDataAvailableError("12-05-2026");
    expect(error).toBeInstanceOf(Error);
  });

  test("is instance of NoDataAvailableError", () => {
    const error = new NoDataAvailableError("12-05-2026");
    expect(error).toBeInstanceOf(NoDataAvailableError);
  });
});
