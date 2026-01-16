import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import serverless from 'serverless-http';
import { AppModule } from './app/app.module';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedHandler: any = null;

async function bootstrapServer() {
  if (cachedHandler) {
    return cachedHandler;
  }

  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);

  const nestApp = await NestFactory.create(AppModule, adapter, {
    logger: ['error', 'warn', 'log'],
  });

  nestApp.enableCors();
  await nestApp.init();

  // Wrap the Express app with serverless-http for Lambda compatibility
  cachedHandler = serverless(expressApp);
  return cachedHandler;
}

// Use Lambda-compatible handler format (named export required for Netlify)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handler = async (event: any, context: any) => {
  // Strip both the Netlify function path prefix and the /api prefix from redirects
  if (event.path) {
    event.path =
      event.path
        .replace('/.netlify/functions/server', '')
        .replace('/api', '') || '/';
  }
  if (event.rawPath) {
    event.rawPath =
      event.rawPath
        .replace('/.netlify/functions/server', '')
        .replace('/api', '') || '/';
  }

  const serverHandler = await bootstrapServer();
  return serverHandler(event, context);
};

// Export config to handle all API routes
export const config = {
  path: '/api/*',
};
