import { EntityRegistryClass } from "../services/EntityRegistry";
import { Result } from "../../domain/valueObjects/Result";

export class ExecuteActionUseCase {
  constructor(
    private readonly registry: EntityRegistryClass
  ) {}

  async execute(
    entityId: string,
    action: string,
    params: any
  ): Promise<Result<void>> {

    const entity = this.registry.getById(entityId);

    if (!entity) {
      return Result.failure("Entity not found");
    }

    const ha = this.registry.getHA();

    if (!ha) {
      return Result.failure(
        "Home Assistant not connected"
      );
    }

    const capability =  entity.capabilities.find(c => c.supports(action));

    if (!capability) {
      return Result.failure(
        `Action ${action} not supported`
      );
    }

    return capability.execute(
      action,
      params,
      entity,
      ha
    );
  }
}