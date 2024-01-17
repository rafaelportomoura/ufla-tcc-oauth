import { NextFunction, Request, Response } from 'express';
import { Validator } from '../adapters/validate';
import { LoginBusiness } from '../business/login';
import { HTTP_STATUS_CODE } from '../constants/httpStatus';
import { LoginDTO } from '../dtos/login';

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validator = new Validator(req.body);
    const body = await validator.validateByClass(LoginDTO);
    const response = await new LoginBusiness().login(body);
    res.status(HTTP_STATUS_CODE.CREATED).json(response);
  } catch (error) {
    next(error);
  }
}
