import { EntityRegistryClass } from "../services/EntityRegistry";
import { SpatialInformationService } from "../services/SpatialInformationService";

import { SpatialDigitalTwin } from "../../domain/valueObjects/SpatialDigitalTwin";
import { SpatialDigitalTwinFactory } from "../../domain/factories/SpatialDigitalTwinFactory";

export class GetSpatialDigitalTwinUseCase {

  constructor(
    private readonly entityRegistry:
      EntityRegistryClass,

    private readonly spatialService:
      SpatialInformationService
  ) {}

  async execute(
    entityId: string
  ): Promise<SpatialDigitalTwin | null> {

    const entity =
      this.entityRegistry.getById(
        entityId
      );

    if (!entity) {
      return null;
    }

    const spatialInformation =
      await this.spatialService.getByEntityId(
        entityId
      );

    if (!spatialInformation) {
      return null;
    }

    return SpatialDigitalTwinFactory.create(
      entity,
      spatialInformation
    );
  }
}