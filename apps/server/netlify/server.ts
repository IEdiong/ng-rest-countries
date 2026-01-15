import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app/app.module';
import type { Context } from '@netlify/functions';
import { INestApplication } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import type { Express, Request, Response } from 'express';

let cachedApp: Express | null = null;

async function bootstrapServer(): Promise<Express> {
  if (cachedApp) {
    return cachedApp;
  }

  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);

  const app: INestApplication = await NestFactory.create(AppModule, adapter);
  app.setGlobalPrefix('api');
  app.enableCors();
  await app.init();

  cachedApp = expressApp;
  return cachedApp;
}

async function handleNetlifyRequest(
  req: Request,
  _context: Context,
): Promise<Response> {
  const expressApp = await bootstrapServer();

  // Netlify CLI passes rawUrl, production uses url
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawUrl = (req as any).rawUrl || req.url;
  
  // Handle both full URLs and path-only URLs
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    // If URL parsing fails, it's likely a path-only URL
    url = new URL(rawUrl, 'http://localhost');
  }

  // Parse request body if present
  let body: string | undefined;
  if (req.body) {
    try {
      body = await req.text();
    } catch {
      body = undefined;
    }
  }

  return new Promise((resolve) => {
    // Build headers object - handle both Headers instance and plain object
    const headers: Record<string, string> = {};
    const reqHeaders = req.headers;
    
    if (reqHeaders && typeof reqHeaders === 'object') {
      if (typeof (reqHeaders as Headers).forEach === 'function') {
        // Standard Headers object
        (reqHeaders as Headers).forEach((value, key) => {
          headers[key] = value;
        });
      } else {
        // Plain object (Netlify CLI)
        Object.entries(reqHeaders as unknown as Record<string, string>).forEach(([key, value]) => {
          headers[key.toLowerCase()] = value;
        });
      }
    }

    // Strip the Netlify function path prefix to get the actual API path
    let pathname = url.pathname;
    const functionPathPrefix = '/.netlify/functions/server';
    if (pathname.startsWith(functionPathPrefix)) {
      pathname = pathname.slice(functionPathPrefix.length) || '/';
    }

    // Create Express-like request object
    const mockReq = {
      method: req.method,
      url: pathname + url.search,
      path: pathname,
      originalUrl: pathname + url.search,
      query: Object.fromEntries(url.searchParams),
      headers,
      body:
        body && headers['content-type']?.includes('application/json')
          ? JSON.parse(body)
          : body,
      get: (name: string) => headers[name.toLowerCase()],
      header: (name: string) => headers[name.toLowerCase()],
    } as unknown as ExpressRequest;

    // Create Express-like response object
    const chunks: Uint8Array[] = [];
    let statusCode = 200;
    const responseHeaders: Record<string, string> = {};

    interface MockResponse {
      statusCode: number;
      status(code: number): this;
      set(name: string, value: string): this;
      setHeader(name: string, value: string): this;
      getHeader(name: string): string | undefined;
      write(chunk: string | Buffer): boolean;
      end(chunk?: string | Buffer): void;
      json(data: unknown): void;
      send(data: string | Buffer | object): void;
    }

    const mockRes: MockResponse = {
      statusCode: 200,
      status(code: number) {
        statusCode = code;
        this.statusCode = code;
        return this;
      },
      set(name: string, value: string) {
        responseHeaders[name.toLowerCase()] = value;
        return this;
      },
      setHeader(name: string, value: string) {
        responseHeaders[name.toLowerCase()] = value;
        return this;
      },
      getHeader(name: string) {
        return responseHeaders[name.toLowerCase()];
      },
      write(chunk: string | Buffer) {
        chunks.push(
          typeof chunk === 'string'
            ? new TextEncoder().encode(chunk)
            : new Uint8Array(chunk),
        );
        return true;
      },
      end(chunk?: string | Buffer) {
        if (chunk) {
          chunks.push(
            typeof chunk === 'string'
              ? new TextEncoder().encode(chunk)
              : new Uint8Array(chunk),
          );
        }

        const totalLength = chunks.reduce((acc, c) => acc + c.length, 0);
        const bodyBytes = new Uint8Array(totalLength);
        let offset = 0;
        for (const c of chunks) {
          bodyBytes.set(c, offset);
          offset += c.length;
        }

        resolve(
          new Response(bodyBytes, {
            status: statusCode,
            headers: responseHeaders,
          }),
        );
      },
      json(data: unknown) {
        responseHeaders['content-type'] = 'application/json';
        this.end(JSON.stringify(data));
      },
      send(data: string | Buffer | object) {
        if (typeof data === 'object' && !(data instanceof Buffer)) {
          this.json(data);
        } else {
          this.end(data as string | Buffer);
        }
      },
    };

    // Pass to Express app
    expressApp(mockReq, mockRes as unknown as ExpressResponse, () => {
      resolve(new Response('Not Found', { status: 404 }));
    });
  });
}

// Modern Netlify function format (default export)
export default handleNetlifyRequest;

// Legacy handler format for Netlify CLI compatibility
// Returns object instead of Response for older Netlify runtime
export const handler = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  event: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _context: any,
) => {
  const expressApp = await bootstrapServer();

  // Extract URL from event (CLI vs production)
  const rawUrl = event.rawUrl || event.path || '/';
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    url = new URL(rawUrl, 'http://localhost');
  }

  // Parse headers
  const headers: Record<string, string> = {};
  if (event.headers) {
    Object.entries(event.headers as Record<string, string>).forEach(
      ([key, value]) => {
        headers[key.toLowerCase()] = value;
      },
    );
  }

  // Parse body
  let body = event.body;
  if (body && event.isBase64Encoded) {
    body = Buffer.from(body, 'base64').toString('utf-8');
  }

  // Strip the Netlify function path prefix to get the actual API path
  let pathname = url.pathname;
  const functionPathPrefix = '/.netlify/functions/server';
  if (pathname.startsWith(functionPathPrefix)) {
    pathname = pathname.slice(functionPathPrefix.length) || '/';
  }

  return new Promise((resolve) => {
    const mockReq = {
      method: event.httpMethod || 'GET',
      url: pathname + url.search,
      path: pathname,
      originalUrl: pathname + url.search,
      query: event.queryStringParameters || {},
      headers,
      body:
        body && headers['content-type']?.includes('application/json')
          ? JSON.parse(body)
          : body,
      get: (name: string) => headers[name.toLowerCase()],
      header: (name: string) => headers[name.toLowerCase()],
    } as unknown as ExpressRequest;

    const chunks: string[] = [];
    let statusCode = 200;
    const responseHeaders: Record<string, string> = {};

    interface LegacyMockResponse {
      statusCode: number;
      status(code: number): this;
      set(name: string, value: string): this;
      setHeader(name: string, value: string): this;
      getHeader(name: string): string | undefined;
      write(chunk: string | Buffer): boolean;
      end(chunk?: string | Buffer): void;
      json(data: unknown): void;
      send(data: string | Buffer | object): void;
    }

    const mockRes: LegacyMockResponse = {
      statusCode: 200,
      status(code: number) {
        statusCode = code;
        this.statusCode = code;
        return this;
      },
      set(name: string, value: string) {
        responseHeaders[name.toLowerCase()] = value;
        return this;
      },
      setHeader(name: string, value: string) {
        responseHeaders[name.toLowerCase()] = value;
        return this;
      },
      getHeader(name: string) {
        return responseHeaders[name.toLowerCase()];
      },
      write(chunk: string | Buffer) {
        chunks.push(typeof chunk === 'string' ? chunk : chunk.toString('utf-8'));
        return true;
      },
      end(chunk?: string | Buffer) {
        if (chunk) {
          chunks.push(
            typeof chunk === 'string' ? chunk : chunk.toString('utf-8'),
          );
        }

        resolve({
          statusCode,
          headers: responseHeaders,
          body: chunks.join(''),
        });
      },
      json(data: unknown) {
        responseHeaders['content-type'] = 'application/json';
        this.end(JSON.stringify(data));
      },
      send(data: string | Buffer | object) {
        if (typeof data === 'object' && !(data instanceof Buffer)) {
          this.json(data);
        } else {
          this.end(data as string | Buffer);
        }
      },
    };

    expressApp(mockReq, mockRes as unknown as ExpressResponse, () => {
      resolve({
        statusCode: 404,
        body: 'Not Found',
      });
    });
  });
};

// Netlify function config for routing
export const config = {
  path: ['/api', '/api/*'],
};
