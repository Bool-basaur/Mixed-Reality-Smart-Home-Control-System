import { CapabilityStrategy } from "../CapabilityStrategy";
import { IoTEntity } from "../../entities/IoTEntity";

export class OnOffCapability extends CapabilityStrategy {
  name = "on_off";
  supports(action: string): boolean {
    return action === "turn_on" || action === "turn_off";
  }
  
  buildServiceCall(action: string, _params?: Record<string, unknown>, entity?: IoTEntity) {
    const targetEntityId = entity?.relations.filter(id => id.startsWith("switch.")).sort((a, b) => a.length - b.length)[0];
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
