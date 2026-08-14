import { IoTEntity } from "../entities/IoTEntity";
import { SpatialDigitalTwin } from "../valueObjects/SpatialDigitalTwin";
import { SpatialInformation } from "../valueObjects/SpatialInformation";

export class SpatialDigitalTwinFactory {

  static create(
    entity: IoTEntity,
    spatialInformation: SpatialInformation
  ): SpatialDigitalTwin {

    return new SpatialDigitalTwin(
      entity,
      spatialInformation
    );
  }
}