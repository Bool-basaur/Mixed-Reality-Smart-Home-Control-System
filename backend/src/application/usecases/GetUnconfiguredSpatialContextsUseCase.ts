import { SpatialEntityContextService }
  from "../services/SpatialEntityContextService";

import { SpatialEntityContext }
  from "../../domain/valueObjects/SpatialEntityContext";
import { UnconfiguredDevice } from "../../api/dtos/UnconfiguredDevice";

export class GetUnconfiguredSpatialContextsUseCase {

  constructor(
    private readonly contextService:
      SpatialEntityContextService
  ) {}

  execute(): UnconfiguredDevice[] {

    return this.contextService.getAll()
      .filter(context => !context.spatialInformation)
      .map(context => ({
        id: context.entity.id,
        name: context.entity.name,
        category: context.entity.category}));
  }
}