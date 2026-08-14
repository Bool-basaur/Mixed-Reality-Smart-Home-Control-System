import { IoTEntity } from "../../domain/entities/IoTEntity";
import { SpatialEntityContext } from "../../domain/valueObjects/SpatialEntityContext";

export interface SystemSnapshot {
  entities: IoTEntity[];
  spatialContexts: SpatialEntityContext[];
}