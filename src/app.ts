import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

import { setupAuthenticationMiddleWare } from './middleware/authentication-middleware';
import registerRoutes from './api/routes/v1';

export default function buildApp(): Express {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());

  setupAuthenticationMiddleWare(app, mongoose.connection);

  const v1Router = express.Router();
  registerRoutes(v1Router);

  app.use('/api/v1', v1Router);

  return app;
}
