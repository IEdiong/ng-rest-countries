# shared

This library contains shared TypeScript interfaces and DTOs used across the rest-countries monorepo.

## Exports

- **ICountry**: Country interface with all fields needed for list and detail views
- **IBorderCountry**: Minimal border country interface (name + alpha3Code)
- **ICurrency**: Currency interface
- **ILanguage**: Language interface
- **PaginatedResponse<T>**: Generic pagination response interface
- **CountryListQuery**: DTO for country list query parameters

## Usage

```typescript
import { ICountry, PaginatedResponse } from "@rest-countries/shared";
```
