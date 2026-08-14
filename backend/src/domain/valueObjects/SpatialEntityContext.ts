import { IoTEntity } from "../entities/IoTEntity";
import { SpatialInformation } from "./SpatialInformation";

export class SpatialEntityContext {

  constructor(
    public readonly entity: IoTEntity,
    public spatialInformation?: SpatialInformation
  ) {}
}