import { Test, TestingModule } from '@nestjs/testing';
import { CountriesService } from './countries.service';
import { CountryListQuery } from '@rest-countries/shared';
import * as fs from 'fs';

jest.mock('fs');

describe('CountriesService', () => {
  let service: CountriesService;

  // Generate 50 items for testing
  const mockCountriesData = Array.from({ length: 50 }, (_, i) => ({
    name: {
      common: `Country${i + 1}`,
      nativeName: {
        eng: {
          common: `Country${i + 1}`,
          official: `Official Country${i + 1}`,
        },
      },
    },
    cca3: `C${(i + 1).toString().padStart(2, '0')}`,
    region: 'Region1',
    population: 1000 + i,
    flags: { svg: `flag${i + 1}.svg`, png: `flag${i + 1}.png` },
    capital: [`Capital${i + 1}`],
    borders: [],
  }));

  beforeEach(async () => {
    (fs.readFileSync as jest.Mock).mockReturnValue(
      JSON.stringify(mockCountriesData),
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [CountriesService],
    }).compile();

    service = module.get<CountriesService>(CountriesService);
    service.onModuleInit();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return correct pagination when passed number values', async () => {
      // page 1, limit 20 -> items 0-19
      const result1 = await service.findAll({ page: 1, limit: 20 });
      expect(result1.data.length).toBe(20);
      expect(result1.data[0].name).toBe('Country1');
      expect(result1.data[19].name).toBe('Country20');

      // page 2, limit 20 -> items 20-39
      const result2 = await service.findAll({ page: 2, limit: 20 });
      expect(result2.data.length).toBe(20);
      expect(result2.data[0].name).toBe('Country21');
      expect(result2.data[19].name).toBe('Country40');
    });

    it('should return correct pagination when passed string values (Bug Reproduction)', async () => {
      // Pass strings as if they came from query params
      const result = await service.findAll({
        page: '2',
        limit: '20',
      } as unknown as CountryListQuery);

      // If bug exists:
      // offset = (2-1)*"20" = 20
      // limit = "20"
      // slice(offset, offset+limit) -> slice(20, "2020")
      // returns everything from 20 to end (30 items: 20-49)

      // We expect 20 items (20-39)
      expect(result.data.length).toBe(20);
      expect(result.data[0].name).toBe('Country21');
      expect(result.data.length).not.toBe(30);
    });
  });
});
