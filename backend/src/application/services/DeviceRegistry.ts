import EventEmitter from "events";
import { Device } from "../../domain/entities/Device";
import { IHomeAssistantAPI } from "../../domain/interfaces/IHomeAssistantAPI";
import { RedisCache } from "../../infrastructure/cache/RedisCache";
import { config } from "../../config/config";
import { EventBus, EVENTS } from "../../infrastructure/events/events";
import { logger } from "../../infrastructure/logger";

class DeviceRegistryClass extends EventEmitter {
  private devices = new Map<string, Device>();
  private haClient: IHomeAssistantAPI | null = null;
  private cache: RedisCache | null = null;

  async init(): Promise<void> {
    logger.info("DeviceRegistry initializing...");

    if (config.useMockData) {
      const { repoMock } = await import("../../infrastructure/db/repoMock");
      const list = await repoMock.getAll();
      list.forEach((d) => this.devices.set(d.id, d));
      return;
    }
  }

  addDevice(device: Device) {
    this.devices.set(device.id, device);
    this.cache?.set(`device:${device.id}`, device.toJSON());

    EventBus.emit(EVENTS.DEVICE_ADDED, device);
    this.emit("device_updated", device);
  }

  removeDevice(id: string) {
    this.devices.delete(id);
    this.cache?.delete(`device:${id}`);

    EventBus.emit(EVENTS.DEVICE_REMOVED, id);
  }

  updateDevice(device: Device) {
    this.devices.set(device.id, device);
    EventBus.emit(EVENTS.DEVICE_STATE_UPDATED, device);
    this.emit("device_updated", device);
  }

  getAll(): Device[] {
    return [...this.devices.values()];
  }

  get(id: string): Device | undefined {
    return this.devices.get(id);
  }

  setHA(ha: IHomeAssistantAPI) {
    this.haClient = ha;
  }

  getHA(): IHomeAssistantAPI | null {
    return this.haClient;
  }
}

export const DeviceRegistry = new DeviceRegistryClass();
export type DeviceRegistry = DeviceRegistryClass;
