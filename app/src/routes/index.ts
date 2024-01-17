import { Router } from 'express';
import { admin_routes } from './admin';
import { customer_routes } from './customer';
import { key_routes } from './keys';
import { sys_admin_routes } from './sysadmin';

const router = Router();
router.use('/key', key_routes);
router.use('/customer', customer_routes);
router.use('/admin', admin_routes);
router.use('/sys_admin_routes', sys_admin_routes);

export { router };
