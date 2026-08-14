import { SpatialEntityContextService }
  from "../services/SpatialEntityContextService";

import { SpatialEntityContext }
  from "../../domain/valueObjects/SpatialEntityContext";

export class GetAllSpatialContextsUseCase {

  constructor(
    private readonly contextService:
      SpatialEntityContextService
  ) {}

  execute():
    SpatialEntityContext[] {

    return this.contextService.getAll();
  }
}