import { SpatialInformationService }
  from "../services/SpatialInformationService";

import { SpatialInformation }
  from "../../domain/valueObjects/SpatialInformation";

export class GetSpatialInformationUseCase {

  constructor(
    private readonly spatialService:
      SpatialInformationService
  ) {}

  async execute(
    entityId: string
  ): Promise<SpatialInformation | null> {

    return this.spatialService.getByEntityId(
      entityId
    );
  }
}