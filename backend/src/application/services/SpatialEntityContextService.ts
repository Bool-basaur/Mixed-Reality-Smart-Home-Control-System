import { EntityRegistryClass }
  from "./EntityRegistry";

import { ISpatialInformationStorage }
  from "../../domain/interfaces/ISpatialInformationStorage";

import { SpatialEntityContext }
  from "../../domain/valueObjects/SpatialEntityContext";

import { SpatialEntityContextRegistry }
  from "./SpatialEntityContextRegistry";

export class SpatialEntityContextService {

  constructor(
    private readonly entityRegistry:
      EntityRegistryClass,

    private readonly spatialStorage:
      ISpatialInformationStorage,

    private readonly contextRegistry:
      SpatialEntityContextRegistry
  ) {}

  async rebuild(): Promise<void> {

    this.contextRegistry.clear();

    const entities = this.entityRegistry.getAll();

    const spatialInfos = await this.spatialStorage.getAll();

    entities.forEach(entity => {

      const spatialInfo = spatialInfos.find( info => info.entityId === entity.id);

      this.contextRegistry.set(new SpatialEntityContext(entity, spatialInfo));
    });
  }

   getAll(): SpatialEntityContext[] {
    return this.contextRegistry.getAll();
   }

   getByEntityId(entityId: string): SpatialEntityContext | undefined {
    return this.contextRegistry.getByEntityId(entityId);
  }

}