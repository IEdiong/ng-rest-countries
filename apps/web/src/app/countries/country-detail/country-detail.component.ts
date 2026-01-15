import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AsyncPipe, DecimalPipe } from '@angular/common';

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
  protected currencies = '';
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly countriesService = inject(CountriesService);
  private readonly titleService = inject(Title);
  private readonly router = inject(Router);

  countryDetail$ = this.activatedRoute.params.pipe(
    map((param) => param['countryCode']),
    switchMap((countryCode) =>
      this.countriesService.singleCountry(countryCode),
    ),
    tap((country) => {
      this.languages = country.languages.map((lang) => lang.name).join(', ');
      this.currencies = country.currencies
        .map((currency) => currency.name)
        .join(', ');
      this.titleService.setTitle(`Countries of the world | ${country.name}`);
    }),
  );

  protected onBack(): void {
    this.router.navigate(['/countries']);
  }
}
