import { Device } from "../../domain/entities/Device";
import { IDeviceRepository } from "../../domain/interfaces/IDeviceRepository";

export class InMemoryDeviceRepository implements IDeviceRepository {
  private devices = new Map<string, Device>();

  async save(device: Device): Promise<void> {
    this.devices.set(device.id, device);
  }

  async remove(id: string): Promise<void> {
    this.devices.delete(id);
  }

  async get(id: string): Promise<Device | undefined> {
    return this.devices.get(id);
  }

  async getAll(): Promise<Device[]> {
    return [...this.devices.values()];
  }
}
