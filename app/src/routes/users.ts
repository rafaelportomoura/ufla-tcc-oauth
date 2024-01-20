/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyInstance, FastifyPluginOptions, FastifyRegisterOptions } from 'fastify';
import { createAdmin } from '../controllers/createAdmin';
import { createCustomer } from '../controllers/createCustomer';
import { getUser } from '../controllers/getUser';
import { sysAdminCreateAdmin } from '../controllers/sysAdminCreateAdmin';

export function users(server: FastifyInstance, _: FastifyRegisterOptions<FastifyPluginOptions>, done: () => void) {
  server.get('/:username', getUser);
  server.post('/admins', createAdmin);
  server.post('/admins/force', sysAdminCreateAdmin);
  server.post('/customers', createCustomer);
  done();
}
