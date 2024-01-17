import { NextFunction, Request, Response } from 'express';
import { Validator } from '../adapters/validate';
import { ForgotPasswordBusiness } from '../business/forgotPassword';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { HTTP_STATUS_CODE } from '../constants/httpStatus';
import { ConfirmForgotPasswordDTO } from '../dtos/confirmForgotPassword';

export async function confirmForgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validator = new Validator(req.body);
    const { username } = await validator.validateByClass(ConfirmForgotPasswordDTO);
    await new ForgotPasswordBusiness().forgot(username);
    res.status(HTTP_STATUS_CODE.OK).json(CODE_MESSAGES.PASSWORD_CHANGED_RESPONSE);
  } catch (error) {
    next(error);
  }
}
