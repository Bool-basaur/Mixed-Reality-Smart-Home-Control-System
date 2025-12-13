import { DeviceRegistryClass } from "./DeviceRegistry";
import { ExecuteActionUseCase } from "../usecases/ExecuteActionUseCase";
import { Result } from "../../domain/valueObjects/Result";
import { Device } from "../../domain/entities/Device";

export class DeviceService {
  constructor(private readonly registry: DeviceRegistryClass) {}

  async list(): Promise<Device[]> {
    return this.registry.getAll();
  }

  async get(id: string): Promise<Device | undefined> {
    return this.registry.get(id);
  }

  async executeAction(
    id: string,
    action: string,
    params: any
  ): Promise<Result<void>> {
    const usecase = new ExecuteActionUseCase(this.registry);
    return usecase.execute(id, action, params);
  }
}
