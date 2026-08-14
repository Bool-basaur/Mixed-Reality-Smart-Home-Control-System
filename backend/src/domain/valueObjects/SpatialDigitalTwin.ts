import { IoTEntity } from "../entities/IoTEntity";
import { SpatialInformation } from "./SpatialInformation";

export class SpatialDigitalTwin {

  constructor(
    public readonly entity: IoTEntity,
    public readonly spatialInformation: SpatialInformation
  ) {}
}