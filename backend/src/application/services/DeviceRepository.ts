import { Device } from "../../domain/entities/Device";
import { repoMock } from "../../infrastructure/db/repoMock";

export class DeviceRepository {
  private devices = new Map<string, Device>();
  async loadFromMock() {
    const list = await repoMock.getAll();
    list.forEach(d => this.devices.set(d.id, d));
  }
  async save(device: Device) { this.devices.set(device.id, device); }
  getAll(): Device[] { return [...this.devices.values()]; }
  get(id: string): Device | undefined { return this.devices.get(id); }
}
export const deviceRepository = new DeviceRepository();
