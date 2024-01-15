import { log } from 'console';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { CONFIGURATION } from '../constants/configuration';
import { error_middleware } from '../middlewares/error';
import { router } from '../routes';

const server = express();
server.use(morgan('dev'));
server.use('/health-check', (_, res) => res.status(200).send('alive'));
server.use(express.json());
server.use(cors());
server.use('/v1', router);

server.use(error_middleware);

server.listen(CONFIGURATION.PORT, () => log(`RUNNING ON PORT ${CONFIGURATION.PORT}`));
