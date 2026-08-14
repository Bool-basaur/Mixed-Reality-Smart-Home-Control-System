import { CapabilityStrategy }
  from "../CapabilityStrategy";

import { Result }
  from "../../valueObjects/Result";

import { IoTEntity }
  from "../../entities/IoTEntity";

import { IHomeAssistantAPI }
  from "../../interfaces/IHomeAssistantAPI";

export class SensorCapability
  extends CapabilityStrategy {

  readonly name =
    "sensor";

  supports(
    _action: string
  ): boolean {

    return false;
  }

  getActions(): string[] {

    return [];
  }

  override async execute(
    _action: string,
    _params: Record<string, unknown>,
    _entity: IoTEntity,
    _ha: IHomeAssistantAPI
  ): Promise<Result<void>> {

    return Result.failure(
      "Sensors cannot execute actions"
    );
  }
}