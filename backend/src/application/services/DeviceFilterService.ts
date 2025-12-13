import { Device } from "../../domain/entities/Device";

export class DeviceFilterService {
  private allowedDomains = ["light", "switch", "media_player", "climate"];

  private forbiddenIdFragments = [
    "_led",
    "_update",
    "_actualizacion",
    "_actualizacion_automatica",
    "_diagnostic"
  ];

  filter(devices: (Device | null)[]): Device[] {
    return devices
      .filter((d): d is Device => d !== null)
      .filter((d) => this.allowedDomains.includes(d.domain))
      .filter((d) => {
        const id = d.id.toLowerCase();
        return !this.forbiddenIdFragments.some(f => id.includes(f));
      });
  }
}

export const deviceFilterService = new DeviceFilterService();
