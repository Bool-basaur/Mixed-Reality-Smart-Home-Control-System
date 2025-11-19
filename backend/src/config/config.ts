import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: Number(process.env.PORT ?? 3000),
  haUrl: process.env.HA_URL ?? "ws://homeassistant.local:8123/api/websocket",
  haToken: process.env.HA_TOKEN ?? "",
  useMockData: process.env.USE_MOCK_DATA === "true",
  enableWs: process.env.ENABLE_WS !== "false",
  env: process.env.NODE_ENV ?? "development",
  redisUrl: process.env.REDIS_URL ?? null,
  requestIdHeader: process.env.REQUEST_ID_HEADER ?? "x-request-id",
};