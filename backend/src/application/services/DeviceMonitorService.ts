import fs from "fs";
import path from "path";

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

  private saveSnapshot(devices: Device[]) {
    try {
      const logsDir = path.resolve(process.cwd(), "logs");

      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
      }

      fs.writeFileSync(
        path.join(logsDir, "device-snapshot.json"),
        JSON.stringify(
          devices.map((d) => d.toJSON()),
          null,
          2
        )
      );
    } catch (err) {
      logger.error("Error saving device snapshot", err);
    }
  }

  private logDevice(title: string, device: Device) {
    logger.info(title, {
      id: device.id,
      name: device.name,
      domain: device.domain,
      capabilities: device.capabilities.map((c) => c.name),
      state: device.state
    });
  }

  start() {
    if (this.intervalId) {
      return;
    }

    this.intervalId = setInterval(async () => {
      try {
        const rawDevices = await this.haClient.getAllEntities();

        const latest: Device[] =
          deviceFilterService.filter(rawDevices);

        const current: Device[] =
          this.registry.getAll();

        this.saveSnapshot(latest);

        const added = latest.filter(
          (d) => !current.some((c) => c.id === d.id)
        );

        const removed = current.filter(
          (c) => !latest.some((d) => d.id === c.id)
        );

        const updated = latest.filter((device) => {
          const existing = current.find(
            (c) => c.id === device.id
          );

          if (!existing) {
            return false;
          }

          return (
            JSON.stringify(existing.state) !==
            JSON.stringify(device.state)
          );
        });

        if (
          added.length === 0 &&
          removed.length === 0 &&
          updated.length === 0
        ) {
          return;
        }

        logger.info("================================================");
        logger.info("HOME ASSISTANT DEVICE CHANGES");
        logger.info("================================================");

        logger.info("SUMMARY", {
          total_devices: latest.length,
          added: added.length,
          removed: removed.length,
          updated: updated.length
        });

        if (added.length > 0) {
          logger.info("--------------- ADDED ----------------");

          added.forEach((device) => {
            this.logDevice("DEVICE ADDED", device);
            this.registry.addDevice(device);
          });
        }

        if (updated.length > 0) {
          logger.info("-------------- UPDATED ---------------");

          updated.forEach((device) => {
            this.logDevice("DEVICE UPDATED", device);
            this.registry.updateDevice(device);
          });
        }

        if (removed.length > 0) {
          logger.info("-------------- REMOVED ---------------");

          removed.forEach((device) => {
            logger.info("DEVICE REMOVED", {
              id: device.id,
              name: device.name,
              domain: device.domain
            });

            this.registry.removeDevice(device.id);
          });
        }

        logger.info("================================================");
      } catch (err) {
        logger.error("Error in DeviceMonitorService:", err);
      }
    }, 5000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}