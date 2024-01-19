/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyInstance, FastifyPluginOptions, FastifyRegisterOptions } from 'fastify';
import { sysAdminCreateAdmin } from '../controllers/sysAdminCreateAdmin';

export function sys_admins(server: FastifyInstance, _: FastifyRegisterOptions<FastifyPluginOptions>, done: () => void) {
  server.post('/admin', sysAdminCreateAdmin);
  done();
}
