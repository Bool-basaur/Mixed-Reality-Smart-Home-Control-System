import { DeviceRegistry } from "../../application/services/DeviceRegistry";

describe("DeviceRegistry Integration", () => {
  beforeAll(async () => {
    process.env.USE_MOCK_DATA = "true";
    await DeviceRegistry.init();
  });

  test("loads mock devices", () => {
    const list = DeviceRegistry.getAll();
    expect(list.length).toBeGreaterThan(0);
  });
});