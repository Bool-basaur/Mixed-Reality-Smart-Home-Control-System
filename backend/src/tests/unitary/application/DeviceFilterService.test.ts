import { DeviceFilterService } from "../../../application/services/DeviceFilterService";
import { GenericDevice } from "../../../domain/entities/GenericDevice";

describe("DeviceFilterService", () => {
  test("filters unsupported domains", () => {
    const service = new DeviceFilterService();

    const devices = [
      new GenericDevice("light.a", "A", "light", [], {}),
      new GenericDevice("sensor.b", "B", "sensor", [], {})
    ];

    const filtered = service.filter(devices as any);

    expect(filtered.length).toBe(1);

    const first = filtered[0]!; // 👈 assert explícito
    expect(first.domain).toBe("light");
  });
});
