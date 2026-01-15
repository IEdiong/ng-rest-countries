import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app/app.module';
import {
  Handler,
  HandlerEvent,
  HandlerContext,
  HandlerResponse,
} from '@netlify/functions';
import { INestApplication } from '@nestjs/common';
import serverlessExpress from '@codegenie/serverless-express';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedServer: any;

async function bootstrapServer() {
  if (!cachedServer) {
    const app: INestApplication = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    app.enableCors();
    await app.init();

    const expressApp = app.getHttpAdapter().getInstance();
    cachedServer = serverlessExpress({ app: expressApp });
  }

  return cachedServer;
}

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext,
): Promise<HandlerResponse> => {
  const server = await bootstrapServer();
  return server(event, context);
};
