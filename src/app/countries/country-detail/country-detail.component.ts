import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { CountryService } from '../shared/country.service';
import {
  IBorderCountry,
  ICountry,
  ICountryLanguage,
} from '../shared/country.model';
import {
  Observable,
  combineLatest,
  concatMap,
  map,
  switchMap,
  tap,
} from 'rxjs';

@Component({
  selector: 'rc-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.scss'],
})
export class CountryDetailComponent implements OnInit {
  languages: string = '';
  countryDetail$!: Observable<ICountry>;
  borderCountries: IBorderCountry[] = [];

  constructor(
    private countryService: CountryService,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {}

  onBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    const countryDetail$ = this.activatedRoute.params.pipe(
      map((param) => param['countryCode']),
      switchMap((countryCode) =>
        this.countryService.singleCountry(countryCode)
      ),
      tap(
        (country) =>
          (this.languages = country.languages
            .map((lang) => lang.name)
            .join(', '))
      )
    );

    const countries$ = this.countryService.allCountries$.pipe(
      map((countries) =>
        countries.map((country) => ({
          name: country.name,
          code: country.alpha3Code,
        }))
      )
    );

    this.countryDetail$ = combineLatest([countryDetail$, countries$]).pipe(
      tap(([country, countries]) => {
        for (let i = 0; i < country.borders.length; i++) {
          this.borderCountries = [
            ...this.borderCountries,
            ...countries.filter((c) => c.code === country.borders[i]),
          ];
        }
      }),
      map(([country, countries]) => country)
    );
  }
}
