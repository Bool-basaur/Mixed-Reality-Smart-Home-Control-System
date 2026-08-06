import { IHomeAssistantAPI } from "../../domain/interfaces/IHomeAssistantAPI";
import { Device } from "../../domain/entities/Device";
import { DeviceFactory } from "../../domain/factories/DeviceFactory";
import path from "path";
import fs from "fs";

export class MockHomeAssistantClient implements IHomeAssistantAPI {
    async connect(): Promise<void> {
        console.log("[MOCK] Home Assistant connected");
    }

    async disconnect(): Promise<void> {
        console.log("[MOCK] Home Assistant disconnected");
    }
    onEvent(_handler: (event: any) => void): void {
        // mock
    }
    async callService(domain: string, service: string, data: any): Promise<any> {
        console.log("[MOCK] callService", { domain, service, data });
        return { success: true };
    }
    async getAllEntities(): Promise<Device[]> {
        const filePath = path.resolve(
            process.cwd(),
            "src/mocks/raw-ha-response.json"
        );

        const raw = fs.readFileSync(
            filePath,
            "utf8"
        );

        const mockStates = JSON.parse(raw);

        return mockStates
            .map((entity: any) =>
            DeviceFactory.fromHA(entity, this)
            )
            .filter(
            (device: any): device is Device =>
                device !== null
            );
    }

    async ping(): Promise<number> {
        return Promise.resolve(1);
    }
}