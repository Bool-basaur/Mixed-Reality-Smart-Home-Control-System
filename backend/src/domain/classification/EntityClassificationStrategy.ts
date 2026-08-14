import { HAEntity } from "../interfaces/HAEntity";
import { IoTEntityCategory } from "../valueObjects/IoTEntityCategory";

export interface EntityClassificationStrategy {
  supports(entity: HAEntity): boolean;

  getCategory(entity: HAEntity): IoTEntityCategory;
}