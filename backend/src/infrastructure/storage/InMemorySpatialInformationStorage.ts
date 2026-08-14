import { ISpatialInformationStorage }
  from "../../domain/interfaces/ISpatialInformationStorage";

import { SpatialInformation }
  from "../../domain/valueObjects/SpatialInformation";

export class InMemorySpatialInformationStorage
  implements ISpatialInformationStorage {

  private spatialInfo =
    new Map<string, SpatialInformation>();

  async save(
    spatialInfo: SpatialInformation
  ): Promise<void> {

    this.spatialInfo.set(
      spatialInfo.entityId,
      spatialInfo
    );
  }

  async getByEntityId(
    entityId: string
  ): Promise<SpatialInformation | null> {

    return this.spatialInfo.get(
      entityId
    ) ?? null;
  }

  async getAll(): Promise<SpatialInformation[]> {

    return [
      ...this.spatialInfo.values()
    ];
  }

  async remove(entityId: string): Promise<void> {

    this.spatialInfo.delete(
      entityId
    );
  }
}