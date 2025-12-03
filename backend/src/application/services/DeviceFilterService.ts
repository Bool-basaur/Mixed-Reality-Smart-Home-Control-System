import { Device } from "../../domain/entities/Device";

export class DeviceFilterService {
  private allowedDomains = ["light", "switch", "media_player", "climate"];
  //private allowedSensors = ["temperature_sensor", "motion_sensor", "humidity_sensor"];

  filter(devices: (Device | null)[]): Device[] {
    return devices
      .filter((d): d is Device => !!d)
      .filter((d) => this.allowedDomains.includes(d.domain));
  }
}

export const deviceFilterService = new DeviceFilterService();
