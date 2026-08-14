import { EntityRegistryClass } from "../services/EntityRegistry";
import { SpatialEntityContextService } from "../services/SpatialEntityContextService";

export class GetSystemSnapshotUseCase {

  constructor(private readonly registry: EntityRegistryClass,
    private readonly contextService: SpatialEntityContextService) {}

  execute() {
    return {
      entities: this.registry.getAll(),
      spatialContexts: this.contextService.getAll()
    };
  }
}