import express from 'express';
import dotenv from 'dotenv';
import {
  setAccessControlHeaders,
  verifyToken,
} from './src/middlewares/index.js';
import cors from 'cors';
import configsInit from './src/config/index.js';
import cookieParser from 'cookie-parser';
import * as routes from './src/routes/index.js';
import awsServerlessExpress from 'aws-serverless-express';
import { parseStageVarsToEnv } from './src/utils/parseStageVarsToEnv.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(setAccessControlHeaders);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/auth', routes.auth);
app.use('/shelters', verifyToken, routes.shelters);
app.use('/branches', verifyToken, routes.branches);
app.use('/users', verifyToken, routes.users);
app.use('/animals', verifyToken, routes.animals);
app.use('/interactions', verifyToken, routes.interactions);
app.use('/', routes.root);

if (!process.env.LAMBDA_TASK_ROOT) {
  app.listen(port, () => {
    console.log(`App is running on port ${port}`);
    configsInit();
  });
}

const server = awsServerlessExpress.createServer(app);

export const handler = (event, context) => {
  parseStageVarsToEnv(event.stageVariables);
  configsInit();

  return awsServerlessExpress.proxy(server, event, context);
};
