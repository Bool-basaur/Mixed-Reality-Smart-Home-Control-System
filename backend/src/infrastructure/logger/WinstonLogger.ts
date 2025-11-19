import winston from "winston";
import { ILogger } from "../../domain/interfaces/ILogger";

export class WinstonLogger implements ILogger {
  private logger: winston.Logger;
  constructor() {
    this.logger = winston.createLogger({
      level: "info",
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      transports: [new winston.transports.Console()]
    });
  }
  info(msg: string, meta?: any) { this.logger.info(msg, meta); }
  warn(msg: string, meta?: any) { this.logger.warn(msg, meta); }
  error(msg: string, meta?: any) { this.logger.error(msg, meta); }
  child(meta: any) { return { info: (m:any, md?:any)=>this.info(m,{...meta,...md}), warn:()=>{}, error:()=>{} } as ILogger; }
}
