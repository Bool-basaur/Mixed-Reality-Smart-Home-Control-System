import EventEmitter from "events";
import { Device } from "../../domain/entities/Device";
import { IHomeAssistantAPI } from "../../domain/interfaces/IHomeAssistantAPI";
import { DeviceStorage } from "../../domain/interfaces/DeviceStorage";
import { EventBus, EVENTS } from "../../infrastructure/events/events";
import { logger } from "../../infrastructure/logger";

class DeviceRegistryClass extends EventEmitter {
  private haClient: IHomeAssistantAPI | null = null;

  constructor(private readonly storage: DeviceStorage) {
    super();
  }

  async init(): Promise<void> {
    logger.info("DeviceRegistry initializing...");
  }

  addDevice(device: Device) {
    this.storage.save(device);

    EventBus.emit(EVENTS.DEVICE_ADDED, device);
    this.emit("device_updated", device);
  }

  removeDevice(id: string) {
    this.storage.remove(id);

    EventBus.emit(EVENTS.DEVICE_REMOVED, id);
  }

  updateDevice(device: Device) {
    this.storage.save(device);

    EventBus.emit(EVENTS.DEVICE_STATE_UPDATED, device);
    this.emit("device_updated", device);
  }

  getAll(): Device[] {
    return this.storage.getAll();
  }

  get(id: string): Device | undefined {
    return this.storage.get(id);
  }

  setHA(ha: IHomeAssistantAPI) {
    this.haClient = ha;
  }

  getHA(): IHomeAssistantAPI | null {
    return this.haClient;
  }
}

export { DeviceRegistryClass };
