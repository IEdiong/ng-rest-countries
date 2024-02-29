import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CountriesService } from '../countries.service';
import {
  BehaviorSubject,
  EMPTY,
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  merge,
  tap,
} from 'rxjs';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ICountry } from '@shared/interfaces';

@Component({
  selector: 'rc-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryListComponent implements OnInit {
  pageSize = 16;
  pageTitle = '';
  errMessage = '';
  searchFormControl = new FormControl('', { nonNullable: true });

  private currentPageSubject = new BehaviorSubject(1);
  currentPageAction$ = this.currentPageSubject.asObservable();
  private selectedRegionSubject = new BehaviorSubject('all');
  selectedRegionAction$ = this.selectedRegionSubject.asObservable();

  countriesByRegion$ = combineLatest([
    this.countriesService.allCountries$,
    this.selectedRegionAction$,
  ]).pipe(
    map(([countries, region]) => {
      if (region === 'all') return countries;
      return countries.filter(
        (country) => country.region.toLowerCase() === region,
      );
    }),
    catchError((err) => {
      this.errMessage = err;
      return EMPTY;
    }),
  );

  currentPageData$ = combineLatest([
    this.countriesByRegion$,
    this.currentPageAction$,
  ]).pipe(
    map(([countries, page]) => countries.slice(0, page * this.pageSize)),
    catchError((err) => {
      this.errMessage = err;
      return EMPTY;
    }),
  );

  searchAction$ = this.searchFormControl.valueChanges.pipe(
    debounceTime(500),
    distinctUntilChanged(),
  );

  searchedCountries$ = combineLatest([
    this.countriesService.allCountries$,
    this.searchAction$,
  ]).pipe(
    map(([countries, searchQuery]) =>
      countries.filter((country) => {
        if (searchQuery === '') return countries;
        return country.name.toLowerCase().includes(searchQuery.toLowerCase());
      }),
    ),
  );

  paginatedSearchCountries$ = combineLatest([
    this.searchedCountries$,
    this.currentPageAction$,
  ]).pipe(
    map(([countries, page]) => countries.slice(0, page * this.pageSize)),
    catchError((err) => {
      this.errMessage = err;
      return EMPTY;
    }),
  );

  finalPageData$ = merge(
    this.currentPageData$,
    this.paginatedSearchCountries$,
  ).pipe(
    distinctUntilChanged(),
    tap(() => this.pageTitle.concat(' | Home')),
  );

  constructor(
    private countriesService: CountriesService,
    private titleService: Title,
  ) {}

  ngOnInit(): void {
    this.pageTitle = this.titleService.getTitle();
    this.searchFormControl.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe();
  }

  trackByFn(index: number, country: ICountry) {
    return country.alpha3Code;
  }

  onScroll() {
    this.currentPageSubject.next(this.currentPageSubject.value + 1);
  }

  onRegionSelectionChanged(region: string) {
    this.selectedRegionSubject.next(region);
  }
}

// TODO: 1. Extract all business logic to a service
// TODO: 2. Make component DRY
