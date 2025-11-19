import { Device } from "../entities/Device";
import { Result } from "../valueObjects/Result";
import { IHomeAssistantAPI } from "../interfaces/IHomeAssistantAPI";

export abstract class CapabilityStrategy {
  abstract name: string;
  abstract supports(action: string): boolean;

  buildServiceCall?(action: string, params?: any, device?: Device): { domain?: string; service: string; data?: any };

  async execute(action: string, params: any, device: Device, ha: IHomeAssistantAPI): Promise<Result<void>> {
    if (typeof this.buildServiceCall === "function") {
      const call = this.buildServiceCall(action, params, device);
      const domain = call.domain ?? device.domain;
      try {
        await ha.callService(domain, call.service, { entity_id: device.id, ...(call.data ?? {}) });
        return Result.success();
      } catch (err: any) {
        return Result.failure(err?.message ?? "call failed");
      }
    }
    return Result.failure("execute not implemented for this capability");
  }
}
