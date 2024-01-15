import { Request, Response } from 'express';

export class MockExpress {
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
}
