import { HAEntity } from "../interfaces/HAEntity";
import { MediaPlayerDevice } from "../entities/MediaPlayerDevice";
import { SwitchDevice } from "../entities/SwitchDevice";
import { SensorDevice } from "../entities/SensorDevice";
import { GenericDevice } from "../entities/GenericDevice";
import { CapabilityRegistry } from "../capabilities/registries/CapabilityRegistry";
import { normalizeDomain } from "../valueObjects/Domain";
import { IHomeAssistantAPI } from "../interfaces/IHomeAssistantAPI";

export class DeviceFactory {
  static fromHA(entity: HAEntity, ha?: IHomeAssistantAPI) {
    const domain = normalizeDomain(entity.entity_id?.split?.(".")[0]);
    const caps = CapabilityRegistry.map(entity);

    const commonName = entity.attributes?.friendly_name ?? entity.entity_id;

    switch (domain) {
      case "media_player":
        return new MediaPlayerDevice(entity.entity_id, commonName, domain, caps, { ...entity.attributes, state: entity.state });
      case "switch":
        return new SwitchDevice(entity.entity_id, commonName, domain, caps, { ...entity.attributes, state: entity.state });
      case "sensor":
        return new SensorDevice(entity.entity_id, commonName, domain, caps, { ...entity.attributes, state: entity.state });
      default:
        return new GenericDevice(entity.entity_id, commonName, domain, caps, { ...entity.attributes, state: entity.state });
    }
  }
}
