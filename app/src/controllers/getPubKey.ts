import { NextFunction, Request, Response } from 'express';
import { GetPubKey } from '../business/getPubKey';
import { HTTP_STATUS_CODE } from '../constants/httpStatus';

export async function getPubKey(_: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const business = new GetPubKey();
    const response = await business.get();
    res.status(HTTP_STATUS_CODE.OK).json(response);
  } catch (error) {
    next(error);
  }
}
