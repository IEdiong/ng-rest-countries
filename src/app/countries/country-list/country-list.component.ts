import { Component } from '@angular/core';
import { CountryService } from '../shared/country.service';
import {
  BehaviorSubject,
  EMPTY,
  Subject,
  catchError,
  combineLatest,
  map,
} from 'rxjs';

@Component({
  selector: 'rc-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.scss'],
})
export class CountryListComponent {
  pageSize = 16;
  errMessage = '';

  private currentPageSubject = new BehaviorSubject(1);
  currentPageAction$ = this.currentPageSubject.asObservable();
  private selectedRegionSubject = new BehaviorSubject('all');
  selectedRegionAction$ = this.selectedRegionSubject.asObservable();

  countriesByRegion$ = combineLatest([
    this.countryService.allCountries$,
    this.selectedRegionAction$,
  ]).pipe(
    map(([countries, region]) => {
      if (region === 'all') return countries;
      return countries.filter(
        (country) => country.region.toLowerCase() === region
      );
    }),
    catchError((err) => {
      this.errMessage = err;
      return EMPTY;
    })
  );

  currentPageData$ = combineLatest([
    this.countriesByRegion$,
    this.currentPageAction$,
  ]).pipe(
    map(([countries, page]) => countries.slice(0, page * this.pageSize)),
    catchError((err) => {
      this.errMessage = err;
      return EMPTY;
    })
  );

  constructor(private countryService: CountryService) {}

  onScroll() {
    this.currentPageSubject.next(this.currentPageSubject.value + 1);
  }

  onRegionSelectionChanged(region: string) {
    this.selectedRegionSubject.next(region);
  }
}
