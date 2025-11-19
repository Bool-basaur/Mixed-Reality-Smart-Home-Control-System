// src/domain/capabilities/impl/VolumeCapability.ts
import { CapabilityStrategy } from "../CapabilityStrategy";

export class VolumeCapability extends CapabilityStrategy {
  name = "volume";
  supports(action: string): boolean {
    return action === "set_volume";
  }
  buildServiceCall(_action: string, params?: any) {
    return { domain: "media_player", service: "volume_set", data: { volume_level: params?.level } };
  }
}
