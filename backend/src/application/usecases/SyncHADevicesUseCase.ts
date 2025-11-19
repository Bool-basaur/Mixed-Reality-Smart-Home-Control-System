import { deviceRepository } from "../services/DeviceRepository";
import { IHomeAssistantAPI } from "../../domain/interfaces/IHomeAssistantAPI";

export class SyncHADevicesUseCase {
  constructor(private ha: IHomeAssistantAPI) {}
  async execute() {
    const devices = await this.ha.getAllEntities();
    devices.forEach(d => deviceRepository.save(d));
    return devices;
  }
}
