import { DeviceRegistry } from "./DeviceRegistry";
import { HomeAssistantClient } from "../../infrastructure/ha/HomeAssistantClient";
import { logger } from "../../infrastructure/logger";
import { deviceFilterService } from "./DeviceFilterService";
import { Device } from "../../domain/entities/Device";

export class DeviceMonitorService {
  constructor(
    private registry: DeviceRegistry,
    private haClient: HomeAssistantClient
  ) {}

  start() {
    setInterval(async () => {
      try {
        logger.info(`[INFO] CHECKING DEVICES`);

        const rawDevices = await this.haClient.getAllEntities();
        const latest: Device[] = deviceFilterService.filter(rawDevices);
        const current: Device[] = this.registry.getAll();

        console.log("rawDevices size:", rawDevices.length);
        console.log("filtered devices size:", latest.length);
        console.log("current devices size:", current.length);

        latest.forEach((dev: Device) => {
          if (!dev) return;
          logger.info(
            ` Device id: ${dev.id} Device name: ${dev.name} Device domain: ${dev.domain}`
          );
          Object.keys(dev.state).forEach((key) => {
            const value = dev.state[key];
            console.log(`State key: ${key}, value:`, value);
          });
        });

        // Detect additions
        const added = latest.filter(
          (d) => !current.some((c) => c.id === d.id)
        );

        // Detect removals
        const removed = current.filter(
          (c) => !latest.some((d) => d.id === c.id)
        );

        if (added.length > 0) {
          logger.info("Added devices:", added.map((d) => d.id));
          added.forEach((d) => this.registry.addDevice(d));
        }

        if (removed.length > 0) {
          logger.info("Removed devices:", removed.map((d) => d.id));
          removed.forEach((d) => this.registry.removeDevice(d.id));
        }

      } catch (err) {
        logger.error("Error in DeviceMonitorService:", err);
      }

    }, 60000);
  }
}
