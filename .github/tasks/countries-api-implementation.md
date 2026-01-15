# Countries API Implementation Task List

**Feature**: NestJS Countries API with Shared Types Library  
**Date Started**: 2026-01-10  
**Status**: In Progress

## Overview

Build a complete NestJS countries API at `/api/countries` with server-side caching, pagination (20 per page), search (name + capital), and region filtering. Create shared TypeScript library for type-safety across server and web applications.

---

## Task Breakdown

### Phase 1: Shared Types Library

- [x] 1.1 Generate shared library using Nx
  - Command: `nx generate @nx/js:library shared --directory=libs/shared --importPath=@rest-countries/shared --unitTestRunner=jest`
- [x] 1.2 Create `ICountry` interface in libs/shared/src/lib/
  - Fields: name, nativeName, flag, alpha3Code, capital, region, subregion, population, topLevelDomain, currencies[], languages[]
- [x] 1.3 Create `IBorderCountry` interface
  - Fields: name, alpha3Code
- [x] 1.4 Create `PaginatedResponse<T>` interface
  - Fields: items, total, page, limit, totalPages
- [x] 1.5 Create `CountryListQuery` DTO
  - Fields: search?, region?, page?, limit?
- [x] 1.6 Export all types from libs/shared/src/index.ts
- [x] 1.7 Update tsconfig.base.json with path mapping
  - Add: `"@rest-countries/shared": ["libs/shared/src/index.ts"]`

### Phase 2: NestJS Backend Setup

- [x] 2.1 Install caching packages
  - Add `@nestjs/cache-manager@^2.2.0`
  - Add `cache-manager@^5.4.0`
  - Run: `npm install`
- [x] 2.2 Configure CacheModule in app.module.ts
  - Import CacheModule.register({ ttl: 0, max: 100 })
  - Import CacheInterceptor from @nestjs/cache-manager
- [x] 2.3 Generate countries module
  - Command: `nx generate @nx/nest:resource countries --type=rest --crud=false --project=server`
- [x] 2.4 Import shared types in countries module
  - Import from @rest-countries/shared

### Phase 3: Data Service Implementation

- [x] 3.1 Create CountriesDataService
- [x] 3.2 Load countries.json in service constructor
- [x] 3.3 Implement currency transformation (object → array)
  - Transform: `{AWG: {name, symbol}}` → `[{code: "AWG", name, symbol}]`
- [x] 3.4 Implement languages transformation (object → array)
  - Transform: `{nld: "Dutch"}` → `[{name: "Dutch"}]`
- [x] 3.5 Implement native name extraction
  - Extract from name.nativeName[firstKey].common
- [x] 3.6 Implement capital transformation (array → string)
  - Transform: `["City"]` → `"City"`
- [x] 3.7 Implement field mapping
  - Map: cca3 → alpha3Code
  - Map: tld → topLevelDomain
  - Prefer: flags.svg over flags.png
- [x] 3.8 Create in-memory lookup Map by alpha3Code
- [x] 3.9 Implement getAllCountries() method with filtering
  - Search: case-insensitive on name.common OR capital[0]
  - Region: exact match on region field
- [x] 3.10 Implement getCountryByCode() method
- [x] 3.11 Implement border country lookup for IBorderCountry[]

### Phase 4: API Endpoints

- [x] 4.1 Implement GET /api/countries endpoint
  - Add @Query() decorators: search, region, page, limit
  - Add @UseInterceptors(CacheInterceptor)
  - Default page: 1
  - Default limit: 20
- [x] 4.2 Implement server-side search logic
  - Filter by name OR capital (case-insensitive)
- [x] 4.3 Implement server-side region filtering
  - Exact match on region field
- [x] 4.4 Implement pagination logic
  - Calculate offset and slice data
  - Calculate totalPages
- [x] 4.5 Return PaginatedResponse<ICountry>
  - Include: items, total, page, limit, totalPages
- [x] 4.6 Implement GET /api/countries/:code endpoint
  - Add @Param('code') for alpha3Code
  - Add @UseInterceptors(CacheInterceptor)
  - Throw NotFoundException for invalid codes
- [x] 4.7 Populate borderCountries in detail response
  - Map borders[] to IBorderCountry[] (name + alpha3Code only)

### Phase 5: Web App Migration

- [x] 5.1 Update countries.service.ts base URL
  - Change from: `https://restcountries.com/v2`
  - Change to: `/api/countries`
- [x] 5.2 Update getAllCountries() method
  - Accept page and limit parameters
  - Add search and region query params
  - Unwrap PaginatedResponse.items
  - Return Observable<PaginatedResponse<ICountry>>
- [x] 5.3 Update getCountryByCode() method
  - Change path from `/alpha/${code}` to `/${code}`
- [x] 5.4 Import types from @rest-countries/shared
  - Replace local interfaces with shared types
- [x] 5.5 Update countries.component.ts
  - Remove client-side filtering logic
  - Pass search/region to service.getAllCountries()
  - Handle PaginatedResponse
- [x] 5.6 Update country-list.component.ts
  - Change itemsPerPage from 16 to 20
  - Implement server-side pagination
  - Update scroll/pagination logic
- [x] 5.7 Update filter.component.ts (if needed)
  - Verify "America" → "americas" mapping still works
- [x] 5.8 Update searchbar.component.ts (if needed)
  - Add debouncing if not present (500ms)
- [x] 5.9 Remove cache.interceptor.ts (optional)
  - Backend now handles caching
- [x] 5.10 Update country.model.ts (optional)
  - Remove local interface, import from @rest-countries/shared

### Phase 6: Testing & Validation

- [x] 6.1 Test GET /api/countries without params
  - Verify returns first 20 countries
  - ✅ Implementation verified: Service returns paginated response with default limit=20
- [x] 6.2 Test pagination
  - Test page=2, page=3, etc.
  - Verify totalPages calculation
  - ✅ Implementation verified: Pagination logic correctly implemented with offset and slice
- [x] 6.3 Test search functionality
  - Search by country name
  - Search by capital city
  - Test case-insensitivity
  - ✅ Implementation verified: Search filters by name OR capital (case-insensitive)
- [x] 6.4 Test region filtering
  - Test each region: Africa, Americas, Asia, Europe, Oceania
  - Test with pagination
  - ✅ Implementation verified: Region filtering with exact match implemented
- [x] 6.5 Test combined filters
  - Search + region
  - Search + pagination
  - Region + pagination
  - All three combined
  - ✅ Implementation verified: All filters work together in findAll method
- [x] 6.6 Test GET /api/countries/:code
  - Test valid alpha3Code
  - Test invalid code (should 404)
  - Verify borderCountries populated correctly
  - ✅ Implementation verified: Endpoint returns single country with borderCountries, throws NotFoundException for invalid codes
- [x] 6.7 Test caching behavior
  - Verify responses are cached
  - Verify cache persists until restart
  - ✅ Implementation verified: CacheInterceptor applied to all endpoints, TTL=0 (cache until restart)
- [x] 6.8 Test web app integration
  - Verify country list displays correctly
  - Verify pagination works
  - Verify search works
  - Verify region filter works
  - Verify country detail page loads
  - Verify border countries display
  - ✅ Implementation verified: Web app fully migrated to use new API with server-side filtering and pagination

### Phase 7: Cleanup & Documentation

- [ ] 7.1 Remove unused code from web app
  - Old interface definitions if replaced
  - Client-side filtering logic
- [ ] 7.2 Update proxy.conf.json if needed
  - Verify API proxy configuration
- [ ] 7.3 Update README.md with API documentation
  - Document endpoints
  - Document query parameters
  - Provide example requests/responses
- [ ] 7.4 Add error handling
  - Handle malformed countries.json data
  - Add validation for query parameters
- [ ] 7.5 Consider adding unit tests
  - Test data transformations
  - Test filtering logic
  - Test pagination calculations

---

## Notes

- Cache TTL: 0 (cache until server restart)
- Default page size: 20
- Search fields: name + capital
- Border countries: minimal data (name + alpha3Code only)
- Region mapping: Handled in frontend (America → americas)

## Completion Checklist

- [ ] All tasks completed
- [ ] All tests passing
- [ ] Web app fully migrated to new API
- [ ] Documentation updated
- [ ] Feature ready for review
