import express from 'express';

import { start } from './server';
import { databaseConnection } from './database';

function init() {
  const app = express();
  databaseConnection();
  start(app);
}

init();
