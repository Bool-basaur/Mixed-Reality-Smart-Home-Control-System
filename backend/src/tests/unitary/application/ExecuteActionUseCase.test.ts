import { ExecuteActionUseCase } from "../../../application/usecases/ExecuteActionUseCase";
import { DeviceRegistry } from "../../../application/services/DeviceRegistry";

describe("ExecuteActionUseCase", () => {
  test("fails if device not found", async () => {
    jest.spyOn(DeviceRegistry, "get").mockReturnValue(undefined as any);

    const uc = new ExecuteActionUseCase();
    const res = await uc.execute("x", "turn_on", {});

    expect(res.ok).toBe(false);
  });
});
