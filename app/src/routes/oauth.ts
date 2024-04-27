/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyInstance, FastifyPluginOptions, FastifyRegisterOptions } from 'fastify';
import { confirmForgotPassword } from '../controllers/confirmForgotPassword';
import { forgotPassword } from '../controllers/forgotPassword';
import { login } from '../controllers/login';
import { validateTokenController } from '../controllers/token';

export function oauth(server: FastifyInstance, _: FastifyRegisterOptions<FastifyPluginOptions>, done: () => void) {
  server.post('/login', login);
  server.post('/forgot-password', forgotPassword);
  server.post('/reset-password', confirmForgotPassword);
  server.post('/validate-token', validateTokenController);
  done();
}
