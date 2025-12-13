import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { config } from "../../config/config";
import { logger } from "./index";

export function requestIdMiddleware(req: Request, _res: Response, next: NextFunction) {
  const header = config.requestIdHeader;
  const id = req.headers[header] as string || uuidv4();
  (req as any).requestId = id;
  // attach child logger, this is optional
  (req as any).logger = logger.child ? logger.child({ requestId: id }) : logger;
  next();
}
