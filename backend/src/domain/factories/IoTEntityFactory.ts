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

    const category = this.resolveCategory(device.entities );
    logger.info(
      "IoTEntity created",
      {
        deviceId: device.id,
        deviceName: device.name
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

  private static resolveCategory(entities: HAEntity[]): IoTEntityCategory {

    const domains = entities.map(
      e => e.entity_id.split(".")[0]
    );

    const hasSensor =
      domains.includes("sensor") ||
      domains.includes("binary_sensor") ||
      domains.includes("camera");

    const hasActuator =
      domains.includes("switch") ||
      domains.includes("light") ||
      domains.includes("fan") ||
      domains.includes("cover") ||
      domains.includes("lock") ||
      domains.includes("button");

    if (hasSensor && hasActuator) {
      return "hybrid";
    }

    if (hasSensor) {
      return "sensor";
    }

    return "actuator";
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