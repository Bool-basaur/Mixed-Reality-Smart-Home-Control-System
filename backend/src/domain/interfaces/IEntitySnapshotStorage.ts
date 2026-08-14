import { IoTEntity } from "../entities/IoTEntity";

export interface IEntitySnapshotStorage {

  saveAll(
    entities: IoTEntity[]
  ): Promise<void>;

  getAll(): Promise<IoTEntity[]>;
}