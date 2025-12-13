import { DeviceService } from "../../../application/services/DeviceService";
import { DeviceRegistryClass } from "../../../application/services/DeviceRegistry";
import { InMemoryDeviceStorage } from "../../../infrastructure/storage/InMemoryDeviceStorage";
import { Device } from "../../../domain/entities/Device";

class FakeDevice extends Device {
  updateFromHA(): void {}
}

describe("DeviceService", () => {
  test("list delegates to registry", async () => {
    const registry = new DeviceRegistryClass(new InMemoryDeviceStorage());
    const service = new DeviceService(registry);

    registry.addDevice(
      new FakeDevice("1", "Test", "light", [], {})
    );

    const result = await service.list();
    expect(result.length).toBe(1);
  });
});
