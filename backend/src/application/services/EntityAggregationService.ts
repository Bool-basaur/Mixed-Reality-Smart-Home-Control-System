import { PhysicalDevice } from "../../domain/entities/PhysicalDevice";
import { HAEntity } from "../../domain/interfaces/HAEntity";
import { HADevice } from "../../domain/interfaces/HADevice";
import { HAEntityRegistryEntry } from "../../domain/interfaces/HAEntityRegistryEntry";

export class EntityAggregationService {

  aggregate(
    entities: HAEntity[],
    devices: HADevice[],
    entityRegistry: HAEntityRegistryEntry[]): PhysicalDevice[] {

    const entityToDevice = this.buildEntityToDeviceIndex(entityRegistry);

    const groupedEntities = this.groupEntitiesByDevice(entities, entityToDevice);

    return this.buildPhysicalDevices(groupedEntities, devices);
  }

  private buildEntityToDeviceIndex(entityRegistry: HAEntityRegistryEntry[]): Map<string, string> {

    return new Map(
      entityRegistry
        .filter(entry => entry.deviceId)
        .map(entry => [entry.entityId, entry.deviceId!])
    );
  }

  private groupEntitiesByDevice(
    entities: HAEntity[],
    entityToDevice: Map<string, string>): Map<string, HAEntity[]> {

    return entities
      .filter(entity =>  entityToDevice.has(entity.entity_id))
      .reduce(
        (groups, entity) => {

          const deviceId =  entityToDevice.get(entity.entity_id);

          if (!deviceId) {
            return groups;
          }

          const current = groups.get(deviceId) ?? [];

          groups.set(deviceId, [...current, entity]);

          return groups;

        },
        new Map<string, HAEntity[]>()
      );
  }

  private buildPhysicalDevices(groupedEntities: Map<string, HAEntity[]>, devices: HADevice[]): PhysicalDevice[] {

    const devicesById = new Map( devices.map(device => [device.id, device]));

    return [...groupedEntities.entries()]
      .map(([deviceId, entities]) => {

        const device = devicesById.get(deviceId);

        const primaryEntity = entities[0];

        if (!primaryEntity) {
          throw new Error(`Device ${deviceId} has no entities`);
        }
        console.log(deviceId, entities.map(e => e.entity_id));
        return new PhysicalDevice(deviceId, device?.name ?? deviceId, primaryEntity as HAEntity, entities);});
  }
  
}