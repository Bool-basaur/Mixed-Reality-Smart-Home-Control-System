import { ListDevicesUseCase } from "../../../application/usecases/ListDevicesUseCase";
import { DeviceRegistryClass } from "../../../application/services/DeviceRegistry";
import { InMemoryDeviceStorage } from "../../../infrastructure/storage/InMemoryDeviceStorage";

describe("ListDevicesUseCase", () => {
  test("returns devices from registry", async () => {
    const registry = new DeviceRegistryClass(new InMemoryDeviceStorage());
    const uc = new ListDevicesUseCase(registry);

    const result = await uc.execute();
    expect(Array.isArray(result)).toBe(true);
  });
});
