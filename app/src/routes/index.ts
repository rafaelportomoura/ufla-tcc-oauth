import { FastifyInstance, FastifyPluginOptions, FastifyRegisterOptions } from 'fastify';
import { key } from './keys';
import { oauth } from './oauth';
import { users } from './users';

export function router(server: FastifyInstance, _: FastifyRegisterOptions<FastifyPluginOptions>, done: () => void) {
  server.register(key, { prefix: '/keys' });
  server.register(users, { prefix: '/users' });
  server.register(oauth, { prefix: '/oauth' });
  done();
}
