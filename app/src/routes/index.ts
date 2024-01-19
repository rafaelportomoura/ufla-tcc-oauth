import { FastifyInstance, FastifyPluginOptions, FastifyRegisterOptions } from 'fastify';
import { admin } from './admin';
import { customer } from './customer';
import { key } from './keys';
import { oauth } from './oauth';
import { sys_admins } from './sysadmin';

export function router(server: FastifyInstance, _: FastifyRegisterOptions<FastifyPluginOptions>, done: () => void) {
  server.register(key, { prefix: '/keys' });
  server.register(customer, { prefix: '/customers' });
  server.register(admin, { prefix: '/admins' });
  server.register(sys_admins, { prefix: '/sys_admins' });
  server.register(oauth, { prefix: '/oauth' });
  done();
}
