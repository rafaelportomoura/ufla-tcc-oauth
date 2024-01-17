import { NextFunction, Request, Response } from 'express';
import { Validator } from '../adapters/validate';
import { ForgotPasswordBusiness } from '../business/forgotPassword';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { HTTP_STATUS_CODE } from '../constants/httpStatus';
import { ForgotPasswordDTO } from '../dtos/forgotPassword';

export async function forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validator = new Validator(req.body);
    const { username } = await validator.validateByClass(ForgotPasswordDTO);
    await new ForgotPasswordBusiness().forgot(username);
    res.status(HTTP_STATUS_CODE.ACCEPTED).json(CODE_MESSAGES.FORGOT_PASSWORD_RESPONSE);
  } catch (error) {
    next(error);
  }
}
