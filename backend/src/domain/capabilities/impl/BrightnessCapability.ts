// src/domain/capabilities/impl/BrightnessCapability.ts
import { CapabilityStrategy } from "../CapabilityStrategy";

export class BrightnessCapability extends CapabilityStrategy {
  name = "brightness";
  supports(action: string): boolean {
    return action === "set_brightness";
  }
  buildServiceCall(_action: string, params?: any) {
    return { domain: "light", service: "turn_on", data: { brightness: params?.brightness } };
  }
}
