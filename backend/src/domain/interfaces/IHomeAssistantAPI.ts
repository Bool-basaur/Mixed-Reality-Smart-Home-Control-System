import { Device } from "../entities/Device";

export interface IHomeAssistantAPI {

  connect(): Promise<void>;

  disconnect?(): Promise<void>;

  onEvent(handler: (event: any) => void): void;

  callService(domain: string, service: string, data: any): Promise<any>;

  getAllEntities(): Promise<Device[]>;

  ping?(): Promise<number>;
  
}
