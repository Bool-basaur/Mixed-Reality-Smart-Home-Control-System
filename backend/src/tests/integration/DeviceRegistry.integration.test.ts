import { DeviceRegistryClass } from "../../application/services/DeviceRegistry";
import { InMemoryDeviceStorage } from "../../infrastructure/storage/InMemoryDeviceStorage";
import { Device } from "../../domain/entities/Device";

class FakeDevice extends Device {
  updateFromHA(): void {}
}

describe("DeviceRegistry", () => {
  let registry: DeviceRegistryClass;

  beforeEach(() => {
    registry = new DeviceRegistryClass(new InMemoryDeviceStorage());
  });

  test("adds and retrieves devices", () => {
    registry.addDevice(
      new FakeDevice("1", "Test", "media_player", [], {})
    );

    expect(registry.getAll().length).toBe(1);
  });
});
