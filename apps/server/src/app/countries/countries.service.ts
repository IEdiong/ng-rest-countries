import { Injectable, OnModuleInit } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  ICountry,
  IBorderCountry,
  ICurrency,
  ILanguage,
  PaginatedResponse,
  CountryListQuery,
} from '@rest-countries/shared';

interface RawCountryData {
  name: {
    common: string;
    nativeName?: Record<string, { common: string; official: string }>;
  };
  cca3: string;
  capital?: string[];
  region: string;
  subregion?: string;
  population: number;
  flags: {
    svg: string;
    png: string;
  };
  borders?: string[];
  tld?: string[];
  currencies?: Record<string, { name: string; symbol: string }>;
  languages?: Record<string, string>;
}

@Injectable()
export class CountriesService implements OnModuleInit {
  private countries: ICountry[] = [];
  private countryMap: Map<string, ICountry> = new Map();

  onModuleInit() {
    this.loadCountries();
  }

  private loadCountries(): void {
    const filePath = join(__dirname, './assets/countries.json');
    const rawData = JSON.parse(
      readFileSync(filePath, 'utf-8'),
    ) as RawCountryData[];

    this.countries = rawData.map((raw) => this.transformCountry(raw));

    // Create lookup map by alpha3Code
    this.countries.forEach((country) => {
      this.countryMap.set(country.alpha3Code, country);
    });
  }

  private transformCountry(raw: RawCountryData): ICountry {
    return {
      name: raw.name.common,
      nativeName: this.extractNativeName(raw.name.nativeName),
      flag: raw.flags.svg || raw.flags.png,
      alpha3Code: raw.cca3,
      capital: raw.capital?.[0] || '',
      region: raw.region,
      subregion: raw.subregion || '',
      population: raw.population,
      topLevelDomain: raw.tld || [],
      currencies: this.transformCurrencies(raw.currencies),
      languages: this.transformLanguages(raw.languages),
      flags: raw.flags,
      borders: raw.borders || [],
    };
  }

  private extractNativeName(
    nativeName?: Record<string, { common: string; official: string }>,
  ): string {
    if (!nativeName) return '';
    const firstKey = Object.keys(nativeName)[0];
    return firstKey ? nativeName[firstKey].common : '';
  }

  private transformCurrencies(
    currencies?: Record<string, { name: string; symbol: string }>,
  ): ICurrency[] {
    if (!currencies) return [];
    return Object.entries(currencies).map(([code, details]) => ({
      code,
      name: details.name,
      symbol: details.symbol,
    }));
  }

  private transformLanguages(languages?: Record<string, string>): ILanguage[] {
    if (!languages) return [];
    return Object.values(languages).map((name) => ({ name }));
  }

  private getBorderCountries(borders: string[]): IBorderCountry[] {
    return borders
      .map((code) => {
        const country = this.countryMap.get(code);
        return country
          ? { name: country.name, alpha3Code: country.alpha3Code }
          : null;
      })
      .filter((bc): bc is IBorderCountry => bc !== null);
  }

  async findAll(query: CountryListQuery): Promise<PaginatedResponse<ICountry>> {
    let filtered = [...this.countries];

    // Apply search filter (case-insensitive on name OR capital)
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      filtered = filtered.filter(
        (country) =>
          country.name.toLowerCase().includes(searchLower) ||
          country.capital.toLowerCase().includes(searchLower),
      );
    }

    // Apply region filter (exact match)
    if (query.region) {
      const regionLower = query.region.toLowerCase();
      filtered = filtered.filter(
        (country) => country.region.toLowerCase() === regionLower,
      );
    }

    // Pagination
    const page = query.page || 1;
    const limit = query.limit || 20;
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const items = filtered.slice(offset, offset + limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(code: string): Promise<ICountry | null> {
    const country = this.countryMap.get(code.toUpperCase());
    if (!country) return null;

    // Populate borderCountries
    return {
      ...country,
      borderCountries: this.getBorderCountries(country.borders),
    };
  }
}
