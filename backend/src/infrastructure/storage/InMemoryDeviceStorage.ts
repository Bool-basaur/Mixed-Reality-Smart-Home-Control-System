import { Device } from "../../domain/entities/Device";
import { DeviceStorage } from "../../domain/interfaces/DeviceStorage";

export class InMemoryDeviceStorage implements DeviceStorage {
  private devices = new Map<string, Device>();

  clear(): void {
    this.devices.clear();
  }

  save(device: Device): void {
    this.devices.set(device.id, device);
  }

  remove(id: string): void {
    this.devices.delete(id);
  }

  get(id: string): Device | undefined {
    return this.devices.get(id);
  }

  getAll(): Device[] {
    return [...this.devices.values()];
  }
}
