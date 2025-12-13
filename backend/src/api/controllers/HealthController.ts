import { Request, Response } from "express";
import { DeviceRegistry } from "../../application/services/DeviceRegistry";
import { config } from "../../config/config";

export const healthController = {
  async check(_req: Request, res: Response) {
    const devices = DeviceRegistry.getAll();

    res.json({
      status: "ok",
      uptime: process.uptime(),
      ha_connected: !!DeviceRegistry.getHA(),
      redis: { connected: !!config.redisUrl },
      devices: { count: devices.length },
      timestamp: new Date().toISOString()
    });
  }
};