import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { CountriesService } from './countries.service';
import {
  PaginatedResponse,
  ICountry,
  CountryListQuery,
} from '@rest-countries/shared';

@Controller('countries')
@UseInterceptors(CacheInterceptor)
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  async findAll(
    @Query() query: CountryListQuery,
  ): Promise<PaginatedResponse<ICountry>> {
    return this.countriesService.findAll(query);
  }

  @Get(':code')
  async findOne(@Param('code') code: string): Promise<ICountry> {
    const country = await this.countriesService.findOne(code);
    if (!country) {
      throw new NotFoundException(`Country with code ${code} not found`);
    }
    return country;
  }
}
