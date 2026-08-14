import { EntityRegistryClass } from "../services/EntityRegistry";
import { SpatialInformationService } from "../services/SpatialInformationService";
import { SpatialDigitalTwin } from "../../domain/valueObjects/SpatialDigitalTwin";
import { SpatialDigitalTwinFactory } from "../../domain/factories/SpatialDigitalTwinFactory";

export class GetAllSpatialDigitalTwinsUseCase {

  constructor(
    private readonly entityRegistry:
      EntityRegistryClass,

    private readonly spatialService:
      SpatialInformationService
  ) {}

  async execute():
    Promise<SpatialDigitalTwin[]> {

    const entities =
      this.entityRegistry.getAll();

    const spatialInfos =
      await this.spatialService.getAll();

    const spatialMap = new Map(
      spatialInfos.map(
        spatialInfo => [
          spatialInfo.entityId,
          spatialInfo
        ]
      )
    );

    return entities
      .map(entity => {

        const spatialInfo =
          spatialMap.get(entity.id);

        if (!spatialInfo) {
          return null;
        }

        return SpatialDigitalTwinFactory.create(
          entity,
          spatialInfo
        );
      })
      .filter(
        (
          twin
        ): twin is SpatialDigitalTwin =>
          twin !== null
      );
  }
}