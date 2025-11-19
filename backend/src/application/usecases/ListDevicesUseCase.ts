import { DeviceRegistry } from "../services/DeviceRegistry";

export class ListDevicesUseCase {
  async execute() {
    return DeviceRegistry.getAll();
  }
}

export const listDevicesUseCase = new ListDevicesUseCase();
