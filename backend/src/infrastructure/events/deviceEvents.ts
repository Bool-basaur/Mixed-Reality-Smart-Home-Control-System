import { EventBus, EVENTS } from "../../infrastructure/events/events";
import { InMemoryDeviceRepository } from "../db/InMemoryDeviceRepository"
import { logger } from "../logger";

const repo = new InMemoryDeviceRepository();

EventBus.on(EVENTS.DEVICE_ADDED, async (device) => {
  await repo.save(device);
  logger.info("Persisted device", { id: device.id });
});

EventBus.on(EVENTS.DEVICE_REMOVED, async (id: string) => {
  await repo.remove(id);
  logger.info("Removed device", { id });
});
