import { FastifyBaseLogger, PinoLoggerOptions } from 'fastify/types/logger';

export type LoggerLevel = PinoLoggerOptions['level'];

export type Logger = FastifyBaseLogger;
