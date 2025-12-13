import { Device } from "../entities/Device";

export interface DeviceStorage {
  clear(): void;

  save(device: Device): void;

  remove(id: string): void;

  get(id: string): Device | undefined;

  getAll(): Device[];
}
