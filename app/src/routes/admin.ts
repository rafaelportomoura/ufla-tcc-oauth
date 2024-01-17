import { Router } from 'express';
import { createAdmin } from '../controllers/createAdmin';

const admin_routes = Router();

admin_routes.post('/', createAdmin);

export { admin_routes };
