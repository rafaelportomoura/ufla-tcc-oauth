import { LoggerLevel } from '../constants/loggerLevel';

type log = (...args: unknown[]) => void;

export type Logger = {
  debug: log;
  verbose: log;
  info: log;
  warn: log;
  error: log;
  level: LoggerLevel;
};
