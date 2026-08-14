import { EntityRegistryClass }
  from "../services/EntityRegistry";

import { Result }
  from "../../domain/valueObjects/Result";

export class ExecuteEntityActionUseCase {

  constructor(
    private readonly registry:
      EntityRegistryClass
  ) {}

  async execute(
    entityId: string,
    action: string,
    params: Record<string, unknown> = {}
  ): Promise<Result<void>> {

    const entity =
      this.registry.getById(
        entityId
      );

    if (!entity) {

      return Result.failure(
        "Entity not found"
      );
    }

    const capability =
      entity.capabilities.find(
        capability =>
          capability.supports(
            action
          )
      );

    if (!capability) {
      return Result.failure(
        "Action not supported"
      );
    }

    const ha = this.registry.getHA();

    if (!ha) {
        return Result.failure(
            "Home Assistant not available"
        );
    }

    return capability.execute(action, params, entity, ha);
  }
}