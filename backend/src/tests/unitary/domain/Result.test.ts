import { Result } from "../../../domain/valueObjects/Result";

describe("Result", () => {
  test("success creates ok result", () => {
    const r = Result.success(123);
    expect(r.ok).toBe(true);
    expect(r.value).toBe(123);
  });

  test("failure creates error result", () => {
    const r = Result.failure("error");
    expect(r.ok).toBe(false);
    expect(r.error).toBe("error");
  });
});
