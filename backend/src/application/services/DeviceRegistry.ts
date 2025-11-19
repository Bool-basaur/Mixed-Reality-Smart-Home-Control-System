import EventEmitter from "events";
import { repoMock } from "../../infrastructure/db/repoMock";
import { config } from "../../config/config";
import { Device } from "../../domain/entities/Device";
import { IHomeAssistantAPI } from "../../domain/interfaces/IHomeAssistantAPI";
import { HomeAssistantClient } from "../../infrastructure/ha/HomeAssistantClient";
import { resolveHAUrl } from "../../infrastructure/ha/HAUrlResolver";
import { logger } from "../../infrastructure/logger";
import { RedisCache } from "../../infrastructure/cache/RedisCache";

class DeviceRegistryClass extends EventEmitter {
  private devices = new Map<string, Device>();
  private haClient: IHomeAssistantAPI | null = null;
  private cache: RedisCache | null = null;

  async init(): Promise<void> {
    logger.info("DeviceRegistry initializing...");

    if (config.useMockData) {
      logger.warn("Running in MOCK MODE");
      const list = await repoMock.getAll();
      list.forEach((d) => this.devices.set(d.id, d));
      return;
    }

    // Cache
    if (config.redisUrl) {
      this.cache = new RedisCache(config.redisUrl);
      await this.cache.connect();
    }

    // Home Assistant
    const haUrl = resolveHAUrl(config.haUrl);
    logger.info(`Connecting to Home Assistant at: ${haUrl}`);

    this.haClient = new HomeAssistantClient(haUrl, config.haToken);
    await this.haClient.connect();

    this.haClient.onEvent((event: any) => {
      if (event.type !== "state_changed") return;

      const dev = this.devices.get(event.entity_id);
      if (dev) {
        dev.updateFromHA(event.new_state);
        this.emit("device_updated", dev);

        this.cache?.set(`device:${dev.id}`, dev.toJSON());
      }
    });

    // Load initial devices
    const initialDevices = await this.haClient.getAllEntities();

    initialDevices.forEach((dev: Device) => {
      this.devices.set(dev.id, dev);
      this.cache?.set(`device:${dev.id}`, dev.toJSON());
    });

    logger.info(`Loaded ${initialDevices.length} devices from Home Assistant`);
  }

  getAll(): Device[] {
    return [...this.devices.values()];
  }

  get(id: string): Device | undefined {
    return this.devices.get(id);
  }

  getHA(): IHomeAssistantAPI | null {
    return this.haClient;
  }
}

export const DeviceRegistry = new DeviceRegistryClass();
