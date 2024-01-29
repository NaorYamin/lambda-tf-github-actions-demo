import { analyticsInit } from './analytics.js';
import { databaseInit } from './database.js';

let cachedClient;

const configsInit = () => {
  if (!cachedClient) {
    cachedClient = databaseInit();
  }
  analyticsInit();
};

export default configsInit;
