import { SpatialInformation } from "../valueObjects/SpatialInformation";


export interface ISpatialInformationStorage {

  save(
    spatialInfo: SpatialInformation
  ): Promise<void>;

  getByEntityId(
    entityId: string
  ): Promise<SpatialInformation | null>;

  getAll(): Promise<SpatialInformation[]>;

  remove(entityId: string): Promise<void>;
  
}