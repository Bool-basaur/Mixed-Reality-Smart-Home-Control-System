import { SpatialInformationService }
  from "../services/SpatialInformationService";

import { SpatialInformation }
  from "../../domain/valueObjects/SpatialInformation";

export class SetSpatialInformationUseCase {

  constructor(
    private readonly spatialService:
      SpatialInformationService
  ) {}

  async execute(
    spatialInfo: SpatialInformation
  ): Promise<void> {

    await this.spatialService.save(
      spatialInfo
    );
  }
}