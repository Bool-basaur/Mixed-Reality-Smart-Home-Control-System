import { Device } from "../entities/Device";
export interface IDeviceRepository {
  save(device: Device): Promise<void>;
  get(id: string): Promise<Device | undefined>;
  getAll(): Promise<Device[]>;
}
