import { Router } from 'express';
import { sysAdminCreateAdmin } from '../controllers/sysAdminCreateAdmin';

const sys_admin_routes = Router();

sys_admin_routes.post('/admin', sysAdminCreateAdmin);

export { sys_admin_routes };
