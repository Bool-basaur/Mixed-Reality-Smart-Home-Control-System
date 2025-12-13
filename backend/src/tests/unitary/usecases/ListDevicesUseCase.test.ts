import { ListDevicesUseCase } from "../../../application/usecases/ListDevicesUseCase";
import { DeviceRegistry } from "../../../application/services/DeviceRegistry";

describe("ListDevicesUseCase", () => {
  test("returns devices from registry", async () => {
    jest.spyOn(DeviceRegistry, "getAll").mockReturnValue([]);

    const usecase = new ListDevicesUseCase();
    const result = await usecase.execute();

    expect(Array.isArray(result)).toBe(true);
  });
});
