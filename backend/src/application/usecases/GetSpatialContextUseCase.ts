import { SpatialEntityContext }
  from "../../domain/valueObjects/SpatialEntityContext";

import { SpatialEntityContextService }
  from "../services/SpatialEntityContextService";

export class GetSpatialContextUseCase {

  constructor(
    private readonly contextService:
      SpatialEntityContextService
  ) {}

  execute(
    entityId: string
  ): SpatialEntityContext | undefined {

    return this.contextService.getByEntityId(
      entityId
    );
  }
}