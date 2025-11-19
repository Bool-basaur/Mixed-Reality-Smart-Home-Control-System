import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { config } from "./config/config";
import deviceRoutes from "./api/routes/deviceRoutes";
import healthRoutes from "./api/routes/healthRoutes";
import { HomeAssistantClient } from "./infrastructure/ha/HomeAssistantClient";
import { deviceRepository } from "./application/services/DeviceRepository";
import { cacheService } from "./application/services/CacheService";
import { RedisCache } from "./infrastructure/cache/RedisCache";
import { logger } from "./infrastructure/logger";
import { HAListenerService } from "./application/services/HAListenerService";
import { SyncHADevicesUseCase } from "./application/usecases/SyncHADevicesUseCase";

export const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/devices", deviceRoutes);
app.use("/health", healthRoutes);

let server: http.Server;

export const startServer = async () => {
  // Setup cache adapter if Redis configured TODO configure redis
  if (config.redisUrl) {
    const r = new RedisCache(config.redisUrl);
    await r.connect();
    cacheService.setCacheAdapter(r);
  }

  // Create HA client (adapter)
  const haClient = new HomeAssistantClient(config.haUrl, config.haToken);

  // Sync devices
  if (config.useMockData) {
    await deviceRepository.loadFromMock();
  } else {
    await haClient.connect();
    const sync = new SyncHADevicesUseCase(haClient);
    await sync.execute();
    const haListener = new HAListenerService(haClient);
    haListener.start();
  }

  server = http.createServer(app);
  server.listen(config.port, () => logger.info(`Server on ${config.port}`));
  return server;
};

if (require.main === module) startServer();

export { server };
