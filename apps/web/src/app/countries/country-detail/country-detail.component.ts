import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { CountriesService } from '../countries.service';
import { IBorderCountry } from '@shared/interfaces';
import { combineLatest, map, switchMap, tap } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'rc-country-detail',
  templateUrl: './country-detail.component.html',
})
export class CountryDetailComponent {
  languages = '';
  borderCountries: IBorderCountry[] = [];

  countryDetailRoute$ = this.activatedRoute.params.pipe(
    map((param) => param['countryCode']),
    switchMap((countryCode) =>
      this.countriesService.singleCountry(countryCode),
    ),
    tap(
      (country) =>
        (this.languages = country.languages
          .map((lang) => lang.name)
          .join(', ')),
    ),
  );

  countryDetail$ = combineLatest([
    this.countryDetailRoute$,
    this.countriesService.countriesWithCodeName$,
  ]).pipe(
    tap(([country, countries]) => {
      if (country.borders) {
        for (let i = 0; i < country.borders.length; i++) {
          this.borderCountries = [
            ...this.borderCountries,
            ...countries.filter((c) => c.code === country.borders[i]),
          ];
        }
      }
    }),
    map(([country]) => country),
    tap((country) =>
      this.titleService.setTitle(`Countries of the world | ${country.name}`),
    ),
  );

  constructor(
    private countriesService: CountriesService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private titleService: Title,
  ) {}

  onBack(): void {
    this.location.back();
  }
}
