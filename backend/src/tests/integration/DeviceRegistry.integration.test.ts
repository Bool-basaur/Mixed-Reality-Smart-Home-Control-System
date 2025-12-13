import { DeviceRegistry } from "../../application/services/DeviceRegistry";

describe("DeviceRegistry (mock)", () => {
  beforeAll(async () => {
    process.env.USE_MOCK_DATA = "true";
    await DeviceRegistry.init();
  });

  test("loads mock devices", () => {
    const devices = DeviceRegistry.getAll();
    expect(devices.length).toBeGreaterThan(0);
  });
});
