// src/domain/capabilities/impl/SensorCapability.ts
import { CapabilityStrategy } from "../CapabilityStrategy";
import { Result } from "../../valueObjects/Result";
import { Device } from "../../entities/Device";
import { IHomeAssistantAPI } from "../../interfaces/IHomeAssistantAPI";

export class SensorCapability extends CapabilityStrategy {
  name = "sensor";
  supports(_action: string): boolean {
    return false;
  }

  async execute(_action: string, _params: any, _device: Device, _ha: IHomeAssistantAPI): Promise<Result<void>> {
    return Result.failure("Sensors cannot execute actions");
  }
}
