import { HAEntity } from "../../interfaces/HAEntity";

import { CapabilityStrategy }
  from "../CapabilityStrategy";

import { OnOffCapability }
  from "../impl/OnOfCapability";

import { VolumeCapability }
  from "../impl/VolumeCapability";

import { MediaPlaybackCapability }
  from "../impl/MediaPlaybackCapability";

import { SensorCapability }
  from "../impl/SensorCapability";

import { LiveStreamCapability }
  from "../impl/LiveStreamCapability";

import { normalizeDomain }
  from "../../valueObjects/Domain";

export class CapabilityRegistry {

  static map(
    entities: HAEntity[]
  ): CapabilityStrategy[] {

    const capabilities:
      CapabilityStrategy[] = [];

    const domains = entities.map(entity => normalizeDomain(entity.entity_id ?.split(".")[0]));

    const uniqueDomains =
      [...new Set(domains)];

    const addCapability = (
      capability:
        CapabilityStrategy
    ) => {

      const alreadyExists =
        capabilities.some(
          existing =>
            existing.name ===
            capability.name
        );

      if (!alreadyExists) {

        capabilities.push(
          capability
        );
      }
    };

    // Encendido / apagado
    if (
      uniqueDomains.includes("switch") ||
      uniqueDomains.includes("media_player")
    ) {

      addCapability(
        new OnOffCapability()
      );
    }

    // Streaming de cámaras
    if (
      uniqueDomains.includes("camera")
    ) {

      addCapability(
        new LiveStreamCapability()
      );
    }

    // Sensores
    if (
      uniqueDomains.includes("sensor")
    ) {

      addCapability(
        new SensorCapability()
      );
    }

    // Multimedia
    if (
      uniqueDomains.includes("media_player")
    ) {

      addCapability(
        new VolumeCapability()
      );

      addCapability(
        new MediaPlaybackCapability()
      );
    }

    return capabilities;
  }
}