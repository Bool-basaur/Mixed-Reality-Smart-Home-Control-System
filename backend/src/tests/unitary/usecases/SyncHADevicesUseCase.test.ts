import { SyncHADevicesUseCase } from "../../../application/usecases/SyncHADevicesUseCase";
import { Device } from "../../../domain/entities/Device";

describe("SyncHADevicesUseCase", () => {
  test("syncs devices into repository", async () => {
    const fakeDevices = [
      { id: "light.a" } as Device,
      { id: "switch.b" } as Device,
    ];

    const haMock = {
      getAllEntities: jest.fn().mockResolvedValue(fakeDevices),
    };

    const repoMock = {
      save: jest.fn(),
      remove: jest.fn(),
      get: jest.fn(),
      getAll: jest.fn(),
    };

    const usecase = new SyncHADevicesUseCase(
      haMock as any,
      repoMock as any
    );

    const result = await usecase.execute();

    expect(result).toHaveLength(2);
    expect(repoMock.save).toHaveBeenCalledTimes(2);
  });
});
