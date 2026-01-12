
import "dotenv/config";
import express from "express";
import { createServer } from "http";
import type { Express } from "express";

// We load the compiled JS bundle of the routes, built by `script/build.ts`.
// This avoids importing TypeScript files at runtime in Vercel.
async function loadRegisterRoutes(): Promise<
  (httpServer: ReturnType<typeof createServer>, app: Express) => Promise<any>
> {
  // Note: this is a compiled CommonJS bundle; TypeScript will not have types for it.
  // @ts-ignore - compiled file without type declarations
  const mod = await import("../dist/server/routes.cjs");
  return (mod as any).registerRoutes;
}

const app = express();
const httpServer = createServer(app);

// Copy middleware from server/index.ts
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check that doesn't rely on DB
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", env: process.env.NODE_ENV });
});

// Lazily initialize routes once per cold start
const setupPromise = (async () => {
  const registerRoutes = await loadRegisterRoutes();
  await registerRoutes(httpServer, app);
})();

export default async function handler(req: any, res: any) {
  await setupPromise;
  app(req, res);
}
