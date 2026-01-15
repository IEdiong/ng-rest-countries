import type { Context, Config } from '@netlify/functions';
import * as fs from 'fs';
import * as path from 'path';

// Load countries data
let countriesData: any[] | null = null;

function loadCountries(): any[] {
  if (!countriesData) {
    const dataPath = path.join(__dirname, 'assets', 'countries.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    countriesData = JSON.parse(rawData);
  }
  return countriesData!;
}

interface QueryParams {
  page?: string;
  limit?: string;
  search?: string;
  region?: string;
}

function parseQueryParams(url: URL): QueryParams {
  return {
    page: url.searchParams.get('page') || undefined,
    limit: url.searchParams.get('limit') || undefined,
    search: url.searchParams.get('search') || undefined,
    region: url.searchParams.get('region') || undefined,
  };
}

function filterCountries(countries: any[], search?: string, region?: string): any[] {
  let filtered = countries;

  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (country) =>
        country.name?.common?.toLowerCase().includes(searchLower) ||
        country.name?.official?.toLowerCase().includes(searchLower) ||
        country.capital?.some((cap: string) => cap.toLowerCase().includes(searchLower))
    );
  }

  if (region && region !== 'all') {
    filtered = filtered.filter(
      (country) => country.region?.toLowerCase() === region.toLowerCase()
    );
  }

  return filtered;
}

function paginateCountries(countries: any[], page: number, limit: number) {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = countries.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    meta: {
      total: countries.length,
      page,
      limit,
      totalPages: Math.ceil(countries.length / limit),
    },
  };
}

function getCountryByCode(countries: any[], code: string): any | null {
  const codeLower = code.toLowerCase();
  return countries.find(
    (country) =>
      country.cca2?.toLowerCase() === codeLower ||
      country.cca3?.toLowerCase() === codeLower ||
      country.ccn3 === code
  ) || null;
}

export default async (req: Request, context: Context): Promise<Response> => {
  try {
    const url = new URL(req.url);
    const pathname = url.pathname;

    // CORS headers
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle OPTIONS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    // Load countries data
    const countries = loadCountries();

    // Route: GET /api or /api/
    if (pathname === '/api' || pathname === '/api/') {
      return new Response(
        JSON.stringify({ message: 'Welcome to the Countries API' }),
        { status: 200, headers }
      );
    }

    // Route: GET /api/countries
    if (pathname === '/api/countries' || pathname === '/api/countries/') {
      const params = parseQueryParams(url);
      const page = parseInt(params.page || '1', 10);
      const limit = parseInt(params.limit || '20', 10);

      const filtered = filterCountries(countries, params.search, params.region);
      const result = paginateCountries(filtered, page, limit);

      return new Response(JSON.stringify(result), { status: 200, headers });
    }

    // Route: GET /api/countries/:code
    const countryMatch = pathname.match(/^\/api\/countries\/([^/]+)$/);
    if (countryMatch) {
      const code = countryMatch[1];
      const country = getCountryByCode(countries, code);

      if (country) {
        return new Response(JSON.stringify(country), { status: 200, headers });
      } else {
        return new Response(
          JSON.stringify({ error: 'Country not found' }),
          { status: 404, headers }
        );
      }
    }

    // 404 for unknown routes
    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers }
    );
  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const config: Config = {
  path: ['/api', '/api/*'],
};

// Legacy handler export for Netlify CLI compatibility
export const handler = async (event: any, context: any) => {
  try {
    const url = new URL(event.rawUrl || event.path || '/', 'http://localhost');
    const pathname = url.pathname;

    // Strip function path prefix if present
    const cleanPath = pathname.replace(/^\/.netlify\/functions\/server/, '') || '/';
    
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 204, headers, body: '' };
    }

    const countries = loadCountries();

    if (cleanPath === '/api' || cleanPath === '/api/') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Welcome to the Countries API' }),
      };
    }

    if (cleanPath === '/api/countries' || cleanPath === '/api/countries/') {
      const page = parseInt(url.searchParams.get('page') || event.queryStringParameters?.page || '1', 10);
      const limit = parseInt(url.searchParams.get('limit') || event.queryStringParameters?.limit || '20', 10);
      const search = url.searchParams.get('search') || event.queryStringParameters?.search;
      const region = url.searchParams.get('region') || event.queryStringParameters?.region;

      const filtered = filterCountries(countries, search, region);
      const result = paginateCountries(filtered, page, limit);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(result),
      };
    }

    const countryMatch = cleanPath.match(/^\/api\/countries\/([^/]+)$/);
    if (countryMatch) {
      const code = countryMatch[1];
      const country = getCountryByCode(countries, code);

      if (country) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(country),
        };
      } else {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Country not found' }),
        };
      }
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' }),
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error', details: String(error) }),
    };
  }
};
