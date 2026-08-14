import { IoTEntity } from "../entities/IoTEntity";

export interface IEntityStorage {
  clear(): void;

  save(entity: IoTEntity): void;

  remove(id: string): void;

  getById(id: string): IoTEntity | undefined;

  getAll(): IoTEntity[];
}