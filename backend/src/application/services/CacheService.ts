import { ICache } from "../../domain/interfaces/ICache";
export class CacheService {
  constructor(private cache?: ICache) {}
  setCacheAdapter(cache?: ICache) { this.cache = cache; }
  async get<T>(key: string) { return this.cache ? this.cache.get<T>(key) : null; }
  async set<T>(key: string, value: T, ttl?: number) { if (this.cache) await this.cache.set(key, value, ttl); }
}
export const cacheService = new CacheService();
