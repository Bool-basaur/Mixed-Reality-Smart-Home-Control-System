import fs from "fs";
import path from "path";

import { IHomeAssistantAPI } from "../../domain/interfaces/IHomeAssistantAPI";
import { HAEntity } from "../../domain/interfaces/HAEntity";
import { HADevice } from "../../domain/interfaces/HADevice";
import { HAEntityRegistryEntry } from "../../domain/interfaces/HAEntityRegistryEntry";

export class MockHomeAssistantClient
  implements IHomeAssistantAPI {

  async connect(): Promise<void> {
    console.log(
      "[MOCK] Home Assistant connected"
    );
  }

  async disconnect(): Promise<void> {
    console.log(
      "[MOCK] Home Assistant disconnected"
    );
  }

  onEvent( _handler: (event: unknown) => void): void {
    // mock
  }

  async callService(
    _domain: string,
    _service: string,
    _data: unknown
  ): Promise<void> {
    console.log(
      "[MOCK] callService"
    );
  }

  async getAllEntities(): Promise<HAEntity[]> {

    const filePath = path.resolve(
      process.cwd(),
      "src/mocks/raw-ha-response.json"
    );

    const raw = fs.readFileSync(
      filePath,
      "utf8"
    );

    return JSON.parse(raw) as HAEntity[];
  }

  async getDeviceRegistry(): Promise<HADevice[]> {

    const filePath = path.resolve(
      process.cwd(),
      "src/mocks/device-registry.json"
    );

    const raw = fs.readFileSync(
      filePath,
      "utf8"
    );

    return JSON.parse(raw) as HADevice[];
  }

  async getEntityRegistry(): Promise<HAEntityRegistryEntry[]> {

    const filePath = path.resolve(
      process.cwd(),
      "src/mocks/entity-registry.json"
    );

    const raw = fs.readFileSync( filePath, "utf8" );

    return JSON.parse(raw) as HAEntityRegistryEntry[];
  }

  async ping(): Promise<number> {
    return 1;
  }
}