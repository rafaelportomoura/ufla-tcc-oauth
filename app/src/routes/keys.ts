import { Router } from 'express';
import { getPubKey } from '../controllers/getPubKey';

const key_routes = Router();

key_routes.get('/pubkey', getPubKey);

export { key_routes };
