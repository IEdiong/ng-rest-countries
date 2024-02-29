import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { CountriesService } from '../countries.service';
import { IBorderCountry, ICountry } from '@shared/interfaces';
import { Observable, combineLatest, map, switchMap, tap } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'rc-country-detail',
  templateUrl: './country-detail.component.html',
})
export class CountryDetailComponent implements OnInit {
  languages = '';
  countryDetail$!: Observable<ICountry>;
  borderCountries: IBorderCountry[] = [];

  constructor(
    private countriesService: CountriesService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private titleService: Title,
  ) {}

  onBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    const countryDetailRoute$ = this.activatedRoute.params.pipe(
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

    const countries$ = this.countriesService.allCountries$.pipe(
      map((countries) =>
        countries.map((country) => ({
          name: country.name,
          code: country.alpha3Code,
        })),
      ),
    );

    this.countryDetail$ = combineLatest([countryDetailRoute$, countries$]).pipe(
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
  }
}
