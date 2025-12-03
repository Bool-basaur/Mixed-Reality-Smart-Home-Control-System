import WebSocket from "ws";
import { IHomeAssistantAPI } from "../../domain/interfaces/IHomeAssistantAPI";
import { Device } from "../../domain/entities/Device";
import { DeviceFactory } from "../../domain/factories/DeviceFactory";
import { resolveHAUrl } from "./HAUrlResolver";
import { logger } from "../logger";

export class HomeAssistantClient implements IHomeAssistantAPI {
  private ws!: WebSocket;
  private msgId = 1;
  private url: string;
  private token: string;
  private shouldReconnect = true;
  private reconnectDelay = 1000;

  constructor(url: string, token: string) { this.url = resolveHAUrl(url); this.token = token; }

  async connect(): Promise<void> {
    logger.info("Connecting to HA", { url: this.url });
    this.ws = new WebSocket(this.url);

    await new Promise<void>((resolve, reject) => {
      let authed = false;
      this.ws.on("open", () => logger.info("WS open"));
      this.ws.on("message", (raw) => {
        const msg = JSON.parse(raw.toString());
        if (msg.type === "auth_required") {
          this.ws.send(JSON.stringify({ type: "auth", access_token: this.token }));
          return;
        }
        if (msg.type === "auth_invalid") { reject(new Error("auth_invalid")); return; }
        if (msg.type === "auth_ok") { authed = true; resolve(); return; }
      });
      this.ws.on("error", (err) => reject(err));
      this.ws.on("close", () => {
        logger.warn("WS closed");
        if (!authed) reject(new Error("closed before auth"));
        if (this.shouldReconnect) this.scheduleReconnect();
      });
    });
    // reset delay on success
    this.reconnectDelay = 1000;
  }

  private scheduleReconnect() {
    setTimeout(async () => {
      try {
        await this.connect();
      } catch (e) {
        this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000);
        this.scheduleReconnect();
      }
    }, this.reconnectDelay);
  }

  onEvent(handler: (event: any) => void): void {
    this.ws.on("message", (raw) => {
      const msg = JSON.parse(raw.toString());
      if (msg.type === "event") handler(msg.event);
    });
  }

  async callService(domain: string, service: string, data: any): Promise<any> {
    this.ws.send(JSON.stringify({ id: this.msgId++, type: "call_service", domain, service, service_data: data }));
  }

  async getAllEntities(): Promise<Device[]> {
    return new Promise((resolve, reject) => {
      const id = this.msgId++;
      this.ws.send(JSON.stringify({ id, type: "get_states" }));
      this.ws.once("message", (raw) => {
        const msg = JSON.parse(raw.toString());
        const states = Array.isArray(msg.result) ? msg.result : [];
        const devices = states.map((s: any) => DeviceFactory.fromHA(s, this)).filter((d : any) : d is Device => d !== null);
        resolve(devices);
      });
    });
  }

  async ping(): Promise<number> {
    const t0 = Date.now();
    return new Promise((resolve) => {
      const id = this.msgId++;
      this.ws.send(JSON.stringify({ id, type: "ping" }));
      resolve(Date.now() - t0);
    });
  }

  async disconnect(): Promise<void> {
    this.shouldReconnect = false;
    this.ws.close();
  }
}
