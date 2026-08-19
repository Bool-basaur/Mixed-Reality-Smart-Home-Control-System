import WebSocket from "ws";

import { IHomeAssistantAPI } from "../../domain/interfaces/IHomeAssistantAPI";
import { HAEntity } from "../../domain/interfaces/HAEntity";
import { HADevice } from "../../domain/interfaces/HADevice";
import { HAEntityRegistryEntry } from "../../domain/interfaces/HAEntityRegistryEntry";
import { HACommand } from "./HACommand";
import { resolveHAUrl } from "./HAUrlResolver";
import { logger } from "../logger";

export class HomeAssistantClient implements IHomeAssistantAPI {
  private ws!: WebSocket;

  private msgId = 1;

  private readonly url: string;

  private readonly token: string;

  private shouldReconnect = true;

  private reconnectDelay = 1000;

  constructor(url: string, token: string) {
    this.url = resolveHAUrl(url);
    this.token = token;
  }

  async connect(): Promise<void> {
    logger.info("Connecting to HA", {
      url: this.url,
    });

    this.ws = new WebSocket(this.url);

    await new Promise<void>((resolve, reject) => {
      let authed = false;

      this.ws.on("open", () => {
        logger.info("WS open");
      });

      this.ws.on("message", raw => {
        const msg = JSON.parse(raw.toString());

        if (msg.type === "auth_required") {
          this.ws.send(
            JSON.stringify({
              type: "auth",
              access_token: this.token,
            })
          );

          return;
        }

        if (msg.type === "auth_invalid") {
          reject(new Error("auth_invalid"));
          return;
        }

        if (msg.type === "auth_ok") {
          authed = true;
          resolve();
        }
      });

      this.ws.on("error", err => {
        reject(err);
      });

      this.ws.on("close", () => {
        logger.warn("WS closed");

        if (!authed) {
          reject(new Error("closed before auth"));
        }

        if (this.shouldReconnect) {
          this.scheduleReconnect();
        }
      });
    });

    this.reconnectDelay = 1000;
  }

  private scheduleReconnect(): void {
    setTimeout(async () => {
      try {
        await this.connect();
      } catch {
        this.reconnectDelay = Math.min(
          this.reconnectDelay * 2,
          30000
        );

        this.scheduleReconnect();
      }
    }, this.reconnectDelay);
  }

  onEvent(
    handler: (event: unknown) => void
  ): void {
    this.ws.on("message", raw => {
      const msg = JSON.parse(raw.toString());

      if (msg.type === "event") {
        handler(msg.event);
      }
    });
  }

    async callService(
    domain: string,
    service: string,
    data: unknown
  ): Promise<void> {
    this.ws.send(
      JSON.stringify({
        id: this.msgId++,
        type: HACommand.CALL_SERVICE,
        domain,
        service,
        service_data: data,
      })
    );
  }

  async getAllEntities(): Promise<HAEntity[]> {
    return this.sendCommand<HAEntity[]>(
      HACommand.GET_STATES
    );
  }

  async getDeviceRegistry(): Promise<HADevice[]> {
    const result = await this.sendCommand<any[]>(HACommand.DEVICE_REGISTRY_LIST);
    return result.map(device => ({id: device.id, name: device.name, manufacturer: device.manufacturer, model: device.model}));
  }

  async getEntityRegistry(): Promise<HAEntityRegistryEntry[]> {
    const result = await this.sendCommand<any[]>(HACommand.ENTITY_REGISTRY_LIST);
    return result.map(entry => ({entityId: entry.entity_id, deviceId: entry.device_id}));
  }

  async ping(): Promise<number> {
    await this.sendCommand<void>(HACommand.PING);

    return 0;
  }


  async disconnect(): Promise<void> {
    this.shouldReconnect = false;

    this.ws.close();
  }

  private sendCommand<T>(command: HACommand): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const id = this.msgId++;

      const handler = (raw: WebSocket.RawData) => {
        try {
          const msg = JSON.parse(
            raw.toString()
          );

          if (msg.id !== id) {
            return;
          }

          this.ws.off(
            "message",
            handler
          );

          if (!msg.success) {
            reject(
              new Error(
                msg.error?.message ??
                `Command ${command} failed`
              )
            );

            return;
          }

          resolve(msg.result as T);

        } catch (err) {
          reject(err);
        }
      };

      this.ws.on(
        "message",
        handler
      );

      this.ws.send(JSON.stringify({
          id,
          type: command}));
    });
          
  }

}