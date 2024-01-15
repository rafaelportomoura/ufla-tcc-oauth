import { Request } from 'express';

export const create_request_id = (req: Request) => `${req.hostname}:${req.method}:${req.path}:${Date.now()}` as const;
