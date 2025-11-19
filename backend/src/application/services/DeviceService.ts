import { DeviceRegistry } from "./DeviceRegistry";
import { ExecuteActionUseCase } from "../usecases/ExecuteActionUseCase";
import { Result } from "../../domain/valueObjects/Result";
import { Device } from "../../domain/entities/Device";

export class DeviceService {
  async list(): Promise<Device[]> {
    return DeviceRegistry.getAll();
  }

  async get(id: string): Promise<Device | undefined> {
    return DeviceRegistry.get(id);
  }

  async executeAction(id: string, action: string, params: any): Promise<Result<void>> {
    const usecase = new ExecuteActionUseCase();
    return usecase.execute(id, action, params);
  }
}

export const deviceService = new DeviceService();
