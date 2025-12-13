import { DeviceRegistry } from "../../../application/services/DeviceRegistry";
import { GenericDevice } from "../../../domain/entities/GenericDevice";

describe("DeviceRegistry", () => {
  test("adds and retrieves device", () => {
    const d = new GenericDevice("light.a", "Lamp", "light", [], {});
    DeviceRegistry.addDevice(d);

    const all = DeviceRegistry.getAll();
    expect(all.some(x => x.id === "light.a")).toBe(true);
  });
});
