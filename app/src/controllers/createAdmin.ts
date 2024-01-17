import { NextFunction, Request, Response } from 'express';
import { Validator } from '../adapters/validate';
import { CreateUserBusiness } from '../business/createUser';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { USER_COMMON_GROUPS } from '../constants/groups';
import { HTTP_STATUS_CODE } from '../constants/httpStatus';
import { CreateAdminDTO } from '../dtos/admin';

export async function createAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validator = new Validator(req.body);
    const body = await validator.validateByClass(CreateAdminDTO);
    const business = new CreateUserBusiness(USER_COMMON_GROUPS.ADMIN);
    await business.create(body);
    res.status(HTTP_STATUS_CODE.OK).json(CODE_MESSAGES.CUSTOMER_CREATED);
  } catch (error) {
    next(error);
  }
}
