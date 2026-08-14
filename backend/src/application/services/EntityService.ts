import { EntityRegistryClass } from "./EntityRegistry";
import { ExecuteActionUseCase } from "../usecases/ExecuteActionUseCase";
import { Result } from "../../domain/valueObjects/Result";
import { IoTEntity } from "../../domain/entities/IoTEntity";

export class EntityService {
  constructor(
    private readonly registry: EntityRegistryClass
  ) {}

  async list(): Promise<IoTEntity[]> {
    return this.registry.getAll();
  }

  async get(
    id: string
  ): Promise<IoTEntity | undefined> {
    return this.registry.getById(id);
  }

  async executeAction(
    id: string,
    action: string,
    params: any
  ): Promise<Result<void>> {
    const usecase =
      new ExecuteActionUseCase(this.registry);

    return usecase.execute(
      id,
      action,
      params
    );
  }
}