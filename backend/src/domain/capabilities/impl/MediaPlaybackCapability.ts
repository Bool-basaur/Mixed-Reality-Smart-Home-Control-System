import { CapabilityStrategy } from "../CapabilityStrategy";
import { IoTEntity } from "../../entities/IoTEntity";

export class MediaPlaybackCapability
  extends CapabilityStrategy {

  name = "media_playback";

  supports(
    action: string
  ): boolean {

    return [
      "play",
      "pause",
      "stop"
    ].includes(action);
  }

  getActions(): string[] {

    return [
      "play",
      "pause",
      "stop"
    ];
  }

  buildServiceCall(action: string, _params?: Record<string, unknown>, entity?: IoTEntity) {

    const targetEntityId = entity?.entityIds.find(id => id.startsWith( "media_player."));

    const mapping: Record<string, string> = {
      play: "media_play",
      pause: "media_pause",
      stop: "media_stop"
    };

    const service = mapping[action];

    if (!service) {
      throw new Error(
        `Unsupported action: ${action}`
      );
    }

    return {

      domain: "media_player",

      service,

      entityId: targetEntityId
    };
  }
}