import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AsyncPipe, DecimalPipe, Location } from '@angular/common';

import { CountriesService } from '../countries.service';
import { map, switchMap, tap } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'rc-country-detail',
  imports: [DecimalPipe, AsyncPipe, RouterLink],
  templateUrl: './country-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryDetailComponent {
  protected languages = '';
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly countriesService = inject(CountriesService);
  private readonly location = inject(Location);
  private readonly titleService = inject(Title);

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

  onBack(): void {
    this.location.back();
  }
}
