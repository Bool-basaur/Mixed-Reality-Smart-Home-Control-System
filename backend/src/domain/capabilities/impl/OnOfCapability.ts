// src/domain/capabilities/impl/OnOffCapability.ts
import { CapabilityStrategy } from "../CapabilityStrategy";
import { IoTEntity } from "../../entities/IoTEntity";

export class OnOffCapability extends CapabilityStrategy {
  name = "on_off";
  supports(action: string): boolean {
    return action === "turn_on" || action === "turn_off";
  }
  
  buildServiceCall(action: string, _params?: Record<string, unknown>, entity?: IoTEntity) {

    const targetEntityId =
      entity?.entityIds.find(
        id => id.startsWith("switch.")
      );

    return {
      domain: "switch",
      service: action,
      entityId: targetEntityId
    };
  }

  getActions(): string[] {

  return [
    "turn_on",
    "turn_off"
  ];
}
}
