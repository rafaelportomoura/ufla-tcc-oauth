import { NextFunction, Request, Response } from 'express';
import { Logger } from '../adapters/logger';
import { GetBusiness } from '../business/get';
import { create_request_id } from '../utils/createRequestId';

export async function getExampleController(req: Request, res: Response, next: NextFunction): Promise<void> {
  const logger = new Logger(create_request_id(req));
  try {
    const business = new GetBusiness(logger);
    const response = await business.get();
    res.json(response);
  } catch (error) {
    next(error);
  }
}
