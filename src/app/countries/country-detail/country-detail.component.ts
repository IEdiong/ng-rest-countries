import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { CountryService } from '../shared/country.service';
import { ICountry, ICountryLanguage } from '../shared/country.model';
import { Observable, combineLatest, map, switchMap, tap } from 'rxjs';

@Component({
  selector: 'rc-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.scss'],
})
export class CountryDetailComponent implements OnInit {
  languages: string = '';
  countryDetail$!: Observable<ICountry>;

  constructor(
    private countryService: CountryService,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {}

  onBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.countryDetail$ = this.activatedRoute.params.pipe(
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
  }
}
