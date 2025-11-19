// src/domain/capabilities/registries/CapabilityRegistry.ts
import { HAEntity } from "../../interfaces/HAEntity";
import { CapabilityStrategy } from "../CapabilityStrategy";
import { OnOffCapability } from "../impl/OnOfCapability";
import { BrightnessCapability } from "../impl/BrightnessCapability";
import { VolumeCapability } from "../impl/VolumeCapability";
import { MediaPlaybackCapability } from "../impl/MediaPlaybackCapability";
import { SensorCapability } from "../impl/SensorCapability";
import { normalizeDomain } from "../../valueObjects/Domain";

export class CapabilityRegistry {
  static map(entity: HAEntity): CapabilityStrategy[] {
    const safeDomain = normalizeDomain(entity.entity_id?.split?.(".")[0]);
    const caps: CapabilityStrategy[] = [];

    if (["switch", "light"].includes(safeDomain)) caps.push(new OnOffCapability());
    if (safeDomain === "light" && entity.attributes?.brightness !== undefined) caps.push(new BrightnessCapability());
    if (safeDomain === "media_player") {
      caps.push(new OnOffCapability());
      caps.push(new VolumeCapability());
      caps.push(new MediaPlaybackCapability());
    }
    if (safeDomain === "sensor") caps.push(new SensorCapability());

    return caps;
  }
}
