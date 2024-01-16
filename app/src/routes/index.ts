import { Router } from 'express';
import { key_routes } from './keys';

const router = Router();
router.use('/key', key_routes);

export { router };
