import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CountriesService } from '../countries.service';
import {
  BehaviorSubject,
  EMPTY,
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
} from 'rxjs';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ICountry } from '@rest-countries/shared';

@Component({
  selector: 'rc-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryListComponent implements OnInit {
  pageSize = 20;
  pageTitle = '';
  errMessage = '';
  searchFormControl = new FormControl('', { nonNullable: true });

  private currentPageSubject = new BehaviorSubject(1);
  currentPageAction$ = this.currentPageSubject.asObservable();
  private selectedRegionSubject = new BehaviorSubject('all');
  selectedRegionAction$ = this.selectedRegionSubject.asObservable();

  searchAction$ = this.searchFormControl.valueChanges.pipe(
    debounceTime(500),
    distinctUntilChanged(),
  );

  // Server-side filtering and pagination
  finalPageData$ = combineLatest([
    this.searchAction$,
    this.selectedRegionAction$,
    this.currentPageAction$,
  ]).pipe(
    switchMap(([search, region, page]) =>
      this.countriesService.getAllCountries(
        search || undefined,
        region !== 'all' ? region : undefined,
        page,
        this.pageSize,
      ),
    ),
    tap(() => this.pageTitle.concat(' | Home')),
    catchError((err) => {
      this.errMessage = err;
      return EMPTY;
    }),
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
    this.currentPageSubject.next(1); // Reset to page 1
    this.selectedRegionSubject.next(region);
  }
}

// TODO: 1. Extract all business logic to a service
// TODO: 2. Make component DRY
