import { IoTEntity } from "../../domain/entities/IoTEntity";
import { IEntityStorage } from "../../domain/interfaces/IEntityStorage";

export class InMemoryEntityStorage
  implements IEntityStorage {

  private entities =
    new Map<string, IoTEntity>();

  clear(): void {
    this.entities.clear();
  }

  save(entity: IoTEntity): void {
    this.entities.set(entity.id, entity);
  }

  remove(id: string): void {
    this.entities.delete(id);
  }

  getById(id: string): IoTEntity | undefined {
    return this.entities.get(id);
  }

  getAll(): IoTEntity[] {
    return [...this.entities.values()];
  }
}