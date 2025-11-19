import { Request, Response } from "express";
import { config } from "../../config/config";
import { DeviceRepository } from "../../application/services/DeviceRepository";

export const healthController = {
  async check(_req: Request, res: Response) {
    const devicesCount = DeviceRepository.prototype.getAll.call({}) ? 0 : 0;
   
    res.json({
      status: "ok",
      uptime: process.uptime(),
      ha_connected: false,
      redis: { connected: !!config.redisUrl },
      devices: { count: 0 },
      timestamp: new Date().toISOString()
    });
  }
};
