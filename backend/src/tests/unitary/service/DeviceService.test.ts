import { deviceService } from "../../../application/services/DeviceService";
import { DeviceRegistry } from "../../../application/services/DeviceRegistry";

describe("DeviceService", () => {
  test("list delegates to registry", async () => {
    jest.spyOn(DeviceRegistry, "getAll").mockReturnValue([]);

    const result = await deviceService.list();
    expect(result).toEqual([]);
  });
});
