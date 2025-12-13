import { DeviceRegistry } from "../services";
import { ListDevicesUseCase } from "./ListDevicesUseCase";

export const listDevicesUseCase =
  new ListDevicesUseCase(DeviceRegistry);
