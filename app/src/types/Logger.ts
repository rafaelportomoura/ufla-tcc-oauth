export interface ILogger {
  error(...args: unknown[]): void;
  warn(...args: unknown[]): void;
  log(...args: unknown[]): void;
  info(...args: unknown[]): void;
  verbose(...args: unknown[]): void;
  debug(...args: unknown[]): void;
}

export type LoggerLevel = keyof ILogger;
