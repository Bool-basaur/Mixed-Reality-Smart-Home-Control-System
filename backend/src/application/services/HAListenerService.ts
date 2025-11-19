import { IHomeAssistantAPI } from "../../domain/interfaces/IHomeAssistantAPI";
import { deviceRepository } from "./DeviceRepository";
import { DeviceFactory } from "../../domain/factories/DeviceFactory";
import { DeviceEventEmitter } from "./DeviceEventEmitter";
import { logger } from "../../infrastructure/logger";

export class HAListenerService {
  constructor(private ha: IHomeAssistantAPI) {}
  start() {
    this.ha.onEvent((event: any) => {
      if (event.event_type !== "state_changed") return;
      const raw = event.data.new_state;
      const dev = deviceRepository.get(raw.entity_id);
      if (dev) {
        dev.updateFromHA(raw);
        deviceRepository.save(dev);
        logger.info("Device " + dev.name + " with id " + dev.id + " updated.");
        DeviceEventEmitter.emit("device_updated", dev);
      } else {
        const newDev = DeviceFactory.fromHA(raw, this.ha);
        deviceRepository.save(newDev);
        logger.info("Device " + newDev.name + " with id " + newDev.id + " created.");
        DeviceEventEmitter.emit("device_added", newDev);
      }
    });
  }
}
