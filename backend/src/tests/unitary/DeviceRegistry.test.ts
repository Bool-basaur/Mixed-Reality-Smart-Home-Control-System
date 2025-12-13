import { DeviceRegistryClass } from "../../application/services/DeviceRegistry";
import { InMemoryDeviceStorage } from "../../infrastructure/storage/InMemoryDeviceStorage";
import { GenericDevice } from "../../domain/entities/GenericDevice";

describe("DeviceRegistry", () => {
  test("adds and retrieves device", () => {
    const registry = new DeviceRegistryClass(new InMemoryDeviceStorage());

    const d = new GenericDevice("light.a", "Lamp", "light", [], {});
    registry.addDevice(d);

    const all = registry.getAll();
    expect(all.some(x => x.id === "light.a")).toBe(true);
  });
});
