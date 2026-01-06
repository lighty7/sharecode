import 'dotenv/config';
import express from 'express';
import { registerRoutes } from '../server/routes.ts';
import { createServer } from 'http';

const app = express();
const httpServer = createServer(app);

// Copy middleware from server/index.ts
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize routes
// Note: registerRoutes is async, but Vercel expects a sync handler or valid promise
// We need to keep the app instance "warm" or await it
const setupPromise = registerRoutes(httpServer, app);

export default async function handler(req: any, res: any) {
    await setupPromise;
    app(req, res);
}
