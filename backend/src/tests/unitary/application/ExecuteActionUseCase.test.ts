import { ExecuteActionUseCase } from "../../../application/usecases/ExecuteActionUseCase";
import { DeviceRegistryClass } from "../../../application/services/DeviceRegistry";
import { InMemoryDeviceStorage } from "../../../infrastructure/storage/InMemoryDeviceStorage";

describe("ExecuteActionUseCase", () => {
  test("fails if device not found", async () => {
    const registry = new DeviceRegistryClass(new InMemoryDeviceStorage());

    const uc = new ExecuteActionUseCase(registry);
    const res = await uc.execute("x", "turn_on", {});

    expect(res.error).toBeDefined();
  });
});
