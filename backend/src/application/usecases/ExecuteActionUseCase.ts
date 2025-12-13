import { DeviceRegistryClass } from "../services/DeviceRegistry";
import { Result } from "../../domain/valueObjects/Result";

export class ExecuteActionUseCase {
  constructor(private readonly registry: DeviceRegistryClass) {}

  async execute(
    deviceId: string,
    action: string,
    params: any
  ): Promise<Result<void>> {
    const device = this.registry.get(deviceId);
    if (!device) return Result.failure("Device not found");

    const ha = this.registry.getHA();
    if (!ha) return Result.failure("Home Assistant not connected");

    const cap = device.capabilities.find((c) => c.supports(action));
    if (!cap) return Result.failure(`Action ${action} not supported`);

    return cap.execute(action, params, device, ha);
  }
}
