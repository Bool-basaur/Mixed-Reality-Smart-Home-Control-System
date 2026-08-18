import { CapabilityRegistry } from "../capabilities/registries/CapabilityRegistry";
import { IoTEntity } from "../entities/IoTEntity";
import { IoTEntityCategory } from "../valueObjects/IoTEntityCategory";
import { PhysicalDevice } from "../entities/PhysicalDevice";
import { HAEntity } from "../interfaces/HAEntity";
import { logger } from "../../infrastructure/logger";

export class IoTEntityFactory {

  static fromPhysicalDevice(device: PhysicalDevice): IoTEntity {

    const primaryEntity = device.primaryEntity;

    if (!primaryEntity) {
      throw new Error(
        `PhysicalDevice ${device.id} has no primary entity`
      );
    }

    const domain = primaryEntity.entity_id ?.split(".")[0] ?? "";

    const capabilities = CapabilityRegistry.map(device.entities);

    const category = this.resolveCategory(domain );
    logger.info(
      "IoTEntity created",
      {
        deviceId: device.id,
        deviceName: device.name,
        entities: device.entities.map(
          e => e.entity_id
        ),
        capabilities: capabilities.map(
          c => c.name
        )
      }
    );
    const state = this.buildState(device.entities);
    const relations = device.entities.map(entity => entity.entity_id);

    return new IoTEntity(
      device.id,
      device.name,
      category,
      capabilities,
      state,
      primaryEntity.attributes ?? {},
      relations
    );
  }

  private static resolveCategory(
    domain: string
  ): IoTEntityCategory {

    switch (domain) {

      case "sensor":
        return "sensor";

      case "camera":
      case "media_player":
      case "climate":
        return "hybrid";

      case "switch":
      case "light":
      case "fan":
      case "cover":
      case "lock":
        return "actuator";

      default:
        return "actuator";
    }
  }

  private static buildState(
    entities: HAEntity[]
  ): Record<string, unknown> {

    return Object.fromEntries(
      entities.map(entity => [
        entity.entity_id,
        entity.state
      ])
    );
  }
}