import { NextFunction, Request, Response } from 'express';
import { Logger } from '../adapters/logger';

export async function testController(req: Request, res: Response, next: NextFunction): Promise<void> {
  const logger = new Logger();
  logger.debug({
    label: 'getExampleController',
    message: req.headers
  });
  try {
    res.json({ ok: 'ok' });
  } catch (error) {
    next(error);
  }
}
