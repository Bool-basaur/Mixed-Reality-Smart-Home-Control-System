// src/domain/capabilities/impl/MediaPlaybackCapability.ts
import { CapabilityStrategy } from "../CapabilityStrategy";

export class MediaPlaybackCapability extends CapabilityStrategy {
  name = "media_playback";
  supports(action: string): boolean {
    return ["play", "pause", "stop", "media_play", "media_pause"].includes(action);
  }
  buildServiceCall(action: string) {
    const mapping: Record<string, string> = {
      play: "media_play",
      pause: "media_pause",
      stop: "media_stop",
      next: "media_next_track",
      previous: "media_previous_track",
    };
    const svc = mapping[action] ?? action;
    return { domain: "media_player", service: svc };
  }
}
