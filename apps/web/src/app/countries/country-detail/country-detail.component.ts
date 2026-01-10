import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { CountriesService } from '../countries.service';
import { map, switchMap, tap } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'rc-country-detail',
  templateUrl: './country-detail.component.html',
})
export class CountryDetailComponent {
  languages = '';

  countryDetail$ = this.activatedRoute.params.pipe(
    map((param) => param['countryCode']),
    switchMap((countryCode) =>
      this.countriesService.singleCountry(countryCode),
    ),
    tap((country) => {
      this.languages = country.languages.map((lang) => lang.name).join(', ');
      this.titleService.setTitle(`Countries of the world | ${country.name}`);
    }),
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
