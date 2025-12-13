import { DeviceRegistryClass } from "../services/DeviceRegistry";
import { Device } from "../../domain/entities/Device";

export class ListDevicesUseCase {
  constructor(
    private readonly registry: DeviceRegistryClass
  ) {}

  async execute(): Promise<Device[]> {
    return this.registry.getAll();
  }
}
