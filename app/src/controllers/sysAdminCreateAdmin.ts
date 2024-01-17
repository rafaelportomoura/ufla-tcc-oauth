import { NextFunction, Request, Response } from 'express';
import { Validator } from '../adapters/validate';
import { BasicAuthBusiness } from '../business/basicAuth';
import { CreateUserBusiness } from '../business/createUser';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { USER_COMMON_GROUPS } from '../constants/groups';
import { HTTP_STATUS_CODE } from '../constants/httpStatus';
import { CreateUserDTO } from '../dtos/user';

export async function sysAdminCreateAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const auth_string = req.headers.authorization?.split(' ')[1];
    await new BasicAuthBusiness().validate(auth_string);
    const validator = new Validator(req.body);
    const body = await validator.validateByClass(CreateUserDTO);
    const business = new CreateUserBusiness(USER_COMMON_GROUPS.ADMIN);
    await business.create(body);
    res.status(HTTP_STATUS_CODE.OK).json(CODE_MESSAGES.CUSTOMER_CREATED);
  } catch (error) {
    next(error);
  }
}
