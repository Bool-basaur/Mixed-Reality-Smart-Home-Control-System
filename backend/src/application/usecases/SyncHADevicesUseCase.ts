import { IDeviceRepository } from "../../domain/interfaces/IDeviceRepository";
import { IHomeAssistantAPI } from "../../domain/interfaces/IHomeAssistantAPI";
import { Device } from "../../domain/entities/Device";

export class SyncHADevicesUseCase {
  constructor(
    private readonly ha: IHomeAssistantAPI,
    private readonly repository: IDeviceRepository
  ) {}

  async execute(): Promise<Device[]> {
    const devices = await this.ha.getAllEntities();

    for (const device of devices) {
      await this.repository.save(device);
    }

    return devices;
  }
}
