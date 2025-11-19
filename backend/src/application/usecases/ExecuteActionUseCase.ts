import { DeviceRegistry } from "../services/DeviceRegistry";
import { Result } from "../../domain/valueObjects/Result";

export class ExecuteActionUseCase {
  async execute(deviceId: string, action: string, params: any): Promise<Result<void>> {
    const device = DeviceRegistry.get(deviceId);
    if (!device) return Result.failure("Device not found");

    const ha = DeviceRegistry.getHA();
    if (!ha) return Result.failure("Home Assistant not connected");

    const cap = device.capabilities.find((c) => c.supports(action));
    if (!cap) return Result.failure(`Action ${action} not supported`);

    // capability.execute will use ha if it relies on buildServiceCall
    return cap.execute(action, params, device, ha);
  }
}

export const executeActionUseCase = new ExecuteActionUseCase();
