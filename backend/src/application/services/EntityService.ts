import { EntityRegistryClass } from "./EntityRegistry";
import { IoTEntity } from "../../domain/entities/IoTEntity";

export class EntityService {
  constructor(private readonly registry: EntityRegistryClass) {}

  async list(): Promise<IoTEntity[]> {
    return this.registry.getAll();
  }

  async get(
    id: string
  ): Promise<IoTEntity | undefined> {
    return this.registry.getById(id);
  }

}