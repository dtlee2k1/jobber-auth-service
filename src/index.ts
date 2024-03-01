import express from 'express';

import { start } from './server';
import { databaseConnection } from './database';
import envConfig from './config';

function init() {
  envConfig.cloudinaryConfig();
  const app = express();
  databaseConnection();
  start(app);
}

init();
