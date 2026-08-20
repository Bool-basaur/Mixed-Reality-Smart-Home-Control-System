import { IoTEntity } from "../entities/IoTEntity";
import { Result } from "../valueObjects/Result";
import { IHomeAssistantAPI } from "../interfaces/IHomeAssistantAPI";
import { logger } from "../../infrastructure/logger";

export abstract class CapabilityStrategy {
  abstract readonly name: string;

  abstract supports(action: string): boolean;

  abstract getActions(): string[];

  buildServiceCall?(
    action: string,
    params?: Record<string, unknown>,
    entity?: IoTEntity
  ): {
    domain?: string;
    service: string;
    entityId: string | undefined;
    data?: Record<string, unknown>;
  };

  async execute(action: string, params: Record<string, unknown>, entity: IoTEntity, ha: IHomeAssistantAPI): Promise<Result<void>> {

    if (typeof this.buildServiceCall ==="function") {
      const call = this.buildServiceCall(action, params, entity);
      try {        
        await ha.callService(call.domain ?? "", call.service, {entity_id: call.entityId, ...(call.data ?? {}),});
        logger.info("Action executed", {entity, action});
        return Result.success();
      } catch (err: any) {
        return Result.failure(
          err?.message ?? "call failed"
        );
      }
    }

    return Result.failure("execute not implemented for this capability");
  }
}