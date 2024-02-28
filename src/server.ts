import http from 'http';

import { CustomError, IAuthPayload, IErrorResponse, winstonLogger } from '@dtlee2k1/jobber-shared';
import { Application, NextFunction, Request, Response, json, urlencoded } from 'express';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import { verify } from 'jsonwebtoken';
import compression from 'compression';

import envConfig from './config';
import { checkConnection } from './elasticsearch';

const SERVER_PORT = 4002;
const logger = winstonLogger(`${envConfig.ELASTIC_SEARCH_URL}`, 'authServer', 'debug');

export function start(app: Application) {
  securityMiddleware(app);
  standardMiddleware(app);
  routesMiddleware(app);
  startQueues();
  startElasticSearch();
  errorHandler(app);
  startServer(app);
}

function securityMiddleware(app: Application) {
  app.set('trust proxy', 1);
  app.use(hpp());
  app.use(helmet());
  app.use(
    cors({
      origin: envConfig.API_GATEWAY_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    })
  );

  app.use((req: Request, _res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      const payload: IAuthPayload = verify(token, envConfig.JWT_TOKEN!) as IAuthPayload;
      req.currentUser = payload;
    }
    next();
  });
}

function standardMiddleware(app: Application) {
  app.use(compression());
  app.use(urlencoded({ extended: true }));
  app.use(json());
}

function routesMiddleware(app: Application) {
  app.use();
}

async function startQueues() {}

async function startElasticSearch() {
  await checkConnection();
}

function errorHandler(app: Application) {
  app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
    logger.log({ level: 'error', message: `AuthService ${error.comingFrom}: ${error}` });

    if (error instanceof CustomError) {
      res.status(error.statusCode).json(error.serializeErrors());
    }
    next();
  });
}

function startServer(app: Application) {
  try {
    const httpServer = new http.Server(app);
    startHttpServer(httpServer);
  } catch (error) {
    logger.log('error', 'AuthService startServer() error method:', error);
  }
}

async function startHttpServer(httpServer: http.Server) {
  try {
    logger.info(`Auth server has started with process id ${process.pid}`);
    httpServer.listen(SERVER_PORT, () => {
      logger.info(`Auth server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    logger.log('error', 'AuthService startServer() error method:', error);
  }
}
