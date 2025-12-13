import { DeviceRegistryClass } from "./DeviceRegistry";
import { InMemoryDeviceStorage } from "../../infrastructure/storage/InMemoryDeviceStorage";
import { DeviceService } from "./DeviceService";
import { ListDevicesUseCase } from "../usecases/ListDevicesUseCase";

const storage = new InMemoryDeviceStorage();
export const DeviceRegistry = new DeviceRegistryClass(storage);
export const deviceService = new DeviceService(DeviceRegistry);
