import { Router } from 'express';
import { createCustomer } from '../controllers/createCustomer';

const customer_routes = Router();

customer_routes.post('/', createCustomer);

export { customer_routes };
