import { createClient } from "redis";
import { ICache } from "../../domain/interfaces/ICache";
import { logger } from "../logger";

export class RedisCache implements ICache {
  private client;
  constructor(private url: string) {
    this.client = createClient({ url });
    this.client.on("error", (err) => logger.error("Redis Error", err));
  }
  async connect() { await this.client.connect(); logger.info("Redis connected"); }
  async get<T>(key: string) { const raw = await this.client.get(key); return raw ? JSON.parse(raw) as T : null; }
  async set<T>(key: string, value: T, ttlSeconds = 60) { await this.client.set(key, JSON.stringify(value), { EX: ttlSeconds }); }
  async delete(key: string): Promise<void> { await this.client.del(key); }
}
