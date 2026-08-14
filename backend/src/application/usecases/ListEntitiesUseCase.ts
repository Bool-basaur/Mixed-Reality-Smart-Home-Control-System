import { EntityRegistryClass } from "../services/EntityRegistry";
import { IoTEntity } from "../../domain/entities/IoTEntity";

export class ListEntitiesUseCase {
  constructor(
    private readonly registry: EntityRegistryClass
  ) {}

  async execute(): Promise<IoTEntity[]> {
    return this.registry.getAll();
  }
}