import { HAEntity } from "./HAEntity";
import { HADevice } from "./HADevice";
import { HAEntityRegistryEntry } from "./HAEntityRegistryEntry";

export interface IHomeAssistantAPI {

  connect(): Promise<void>;

  disconnect?(): Promise<void>;

  onEvent(
    handler: (event: unknown) => void
  ): void;

  callService(
    domain: string,
    service: string,
    data: unknown
  ): Promise<void>;

  getAllEntities(): Promise<HAEntity[]>;

  getDeviceRegistry(): Promise<HADevice[]>;

  getEntityRegistry(): Promise<
    HAEntityRegistryEntry[]
  >;

  ping?(): Promise<number>;
}