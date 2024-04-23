import FastifyCors from '@fastify/cors';
import Fastify from 'fastify';
import { StatusCodes } from 'http-status-codes';

import { logger_options } from '../adapters/logger';
import { CONFIGURATION } from '../constants/configuration';
import { error_middleware } from '../middlewares/error';
import { router } from '../routes';

(async () => {
  const server = Fastify({
    logger: logger_options(CONFIGURATION.STAGE, CONFIGURATION.LOG_LEVEL)
  });
  await server.register(FastifyCors, {
    origin: '*',
    allowedHeaders: '*',
    methods: '*'
  });
  server.setErrorHandler(error_middleware(server));

  server.get('/health-check', (_, res) => res.status(StatusCodes.OK).send('alive'));

  await server.register(router, { prefix: '/v1' });

  server.listen(
    {
      port: CONFIGURATION.PORT,
      host: '0.0.0.0'
    },
    (err, addr) => {
      if (err) {
        server.log.error(err);
        process.exit(1);
      }

      server.log.info(`RUNNING ON PORT ${addr}`);
    }
  );
})();
