import { CapabilityStrategy }
  from "../CapabilityStrategy";

import { IoTEntity }
  from "../../entities/IoTEntity";

export class VolumeCapability
  extends CapabilityStrategy {

  name = "volume";

  supports(
    action: string
  ): boolean {

    return action === "set_volume";
  }

  getActions(): string[] {

    return [
      "set_volume"
    ];
  }

  buildServiceCall(
    _action: string,
    params?: Record<string, unknown>,
    entity?: IoTEntity
  ) {

    const targetEntityId =
      entity?.entityIds.find(
        id =>
          id.startsWith(
            "media_player."
          )
      );

    return {

      domain: "media_player",

      service: "volume_set",

      entityId: targetEntityId,

      data: {

        volume_level:
          params?.level
      }
    };
  }
}