import { CapabilityStrategy } from "../CapabilityStrategy";

import { IoTEntity } from "../../entities/IoTEntity";

export class LiveStreamCapability extends CapabilityStrategy {

  readonly name = "live_stream";

  supports(action: string): boolean {
    return [
      "start_stream",
      "stop_stream"
    ].includes(action);
  }

  getActions(): string[] {
    return [
      "start_stream",
      "stop_stream"
    ];
  }

  buildServiceCall(action: string, _params?: Record<string, unknown>, entity?: IoTEntity) {

    const targetEntityId =
      entity?.entityIds.find(
        id =>
          id.startsWith(
            "camera."
          )
      );

    return {
      domain: "camera",
      service: action,
      entityId: targetEntityId
    };
  }
}