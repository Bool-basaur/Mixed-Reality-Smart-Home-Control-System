// src/domain/capabilities/impl/OnOffCapability.ts
import { CapabilityStrategy } from "../CapabilityStrategy";

export class OnOffCapability extends CapabilityStrategy {
  name = "on_off";
  supports(action: string): boolean {
    return action === "turn_on" || action === "turn_off";
  }
  buildServiceCall(action: string) {
    return { service: action };
  }
}
