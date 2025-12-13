import { DeviceService } from "../../../application/services/DeviceService";
import { DeviceRegistryClass } from "../../../application/services/DeviceRegistry";
import { InMemoryDeviceStorage } from "../../../infrastructure/storage/InMemoryDeviceStorage";
import { Device } from "../../../domain/entities/Device";

class FakeDevice extends Device {
  updateFromHA(): void {}
}

describe("Device domain & service tests", () => {
  let registry: DeviceRegistryClass;
  let service: DeviceService;

  beforeEach(() => {
    registry = new DeviceRegistryClass(new InMemoryDeviceStorage());
    service = new DeviceService(registry);

    registry.addDevice(
      new FakeDevice("1", "Test", "media_player", [], {})
    );
  });

  test("DeviceService.list returns devices", async () => {
    const devices = await service.list();
    expect(devices.length).toBeGreaterThan(0);
  });

  test("executeAction fails if action not supported", async () => {
    const res = await service.executeAction("1", "non_existing", {});
    expect(res.error).toBeDefined();
  });
});
