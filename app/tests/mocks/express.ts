import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODE } from '../../src/constants/httpStatus';

export class MockExpress {
  static responseData(body: unknown = '', status: number = HTTP_STATUS_CODE.OK) {
    return {
      statusCode: status,
      body: JSON.stringify(body)
    };
  }

  static response(res?: Record<string, unknown>): Response {
    return {
      status(code: number) {
        return MockExpress.response({ ...res, statusCode: code });
      },
      json(body: unknown) {
        return MockExpress.response({ ...res, body: JSON.stringify(body) });
      },
      send() {
        return res;
      },
      ...res
    } as unknown as Response;
  }

  static request(request?: Record<string, unknown>): Request {
    return request as unknown as Request;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  static next(c?: Function): NextFunction {
    const x = (a: Error) => {
      throw a;
    };
    return (c || x) as NextFunction;
  }
}
