import { DeviceRegistryClass } from "./DeviceRegistry";
import { HomeAssistantClient } from "../../infrastructure/ha/HomeAssistantClient";
import { logger } from "../../infrastructure/logger";
import { deviceFilterService } from "./DeviceFilterService";
import { Device } from "../../domain/entities/Device";

export class DeviceMonitorService {
  private intervalId: NodeJS.Timeout | null = null;

  constructor(
    private readonly registry: DeviceRegistryClass,
    private readonly haClient: HomeAssistantClient
  ) {}

  start() {
    if (this.intervalId) return;

    this.intervalId = setInterval(async () => {
      try {
        logger.info("[INFO] CHECKING DEVICES");

        const rawDevices = await this.haClient.getAllEntities();
        const latest: Device[] = deviceFilterService.filter(rawDevices);
        const current: Device[] = this.registry.getAll();

        const added = latest.filter(
          (d) => !current.some((c) => c.id === d.id)
        );

        const removed = current.filter(
          (c) => !latest.some((d) => d.id === c.id)
        );

        added.forEach((d) => this.registry.addDevice(d));
        removed.forEach((d) => this.registry.removeDevice(d.id));

      } catch (err) {
        logger.error("Error in DeviceMonitorService:", err);
      }
    }, 60000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
