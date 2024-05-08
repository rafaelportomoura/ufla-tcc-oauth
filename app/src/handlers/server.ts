/* eslint-disable no-console */
import Fastify from 'fastify';
import { StatusCodes } from 'http-status-codes';

import { CONFIGURATION } from '../constants/configuration';
import { router } from '../routes';

(async () => {
  const server = Fastify({
    logger: {
      level: 'silent'
    }
  });
  server.get('/health-check', (_, res) => res.status(StatusCodes.OK).send('alive'));

  await server.register(router);

  server.listen(
    {
      port: CONFIGURATION.PORT,
      host: '0.0.0.0'
    },
    (err, addr) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }

      console.info(`RUNNING ON PORT ${addr}`);
    }
  );
})();
