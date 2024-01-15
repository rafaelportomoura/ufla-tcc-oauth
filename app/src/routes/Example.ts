import { Router } from 'express';
import { getExampleController } from '../controllers/get';
import { testController } from '../controllers/test';

const example_routes = Router();

example_routes.get('/uai', getExampleController);
example_routes.get('/test', testController);

export { example_routes };
