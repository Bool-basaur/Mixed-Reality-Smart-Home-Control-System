export interface ILogger {

  info(msg: string, meta?: any): void;

  warn(msg: string, meta?: any): void;

  error(msg: string, meta?: any): void;

  child?(meta: any): ILogger;
  
}
