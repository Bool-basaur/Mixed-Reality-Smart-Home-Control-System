import { Device } from "../entities/Device";
import { SpatialInfo } from "./SpatialInfo";

export interface SpatialDevice {
  device: Device;
  spatial: SpatialInfo;
}
