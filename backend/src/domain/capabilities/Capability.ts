import { Device } from "../entities/Device";
import { IHomeAssistantAPI } from "../interfaces/IHomeAssistantAPI";

export abstract class Capability {
  abstract readonly name: string;
  abstract supports(action: string): boolean;

  abstract execute(
    action: string,
    params: any,
    device: Device,
    ha: IHomeAssistantAPI
  ): Promise<any>;
}
