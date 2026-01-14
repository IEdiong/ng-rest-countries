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
  scan,
  switchMap,
  startWith,
  tap,
} from 'rxjs';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ICountry, PaginatedResponse } from '@rest-countries/shared';

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
  totalPages = 0;
  searchFormControl = new FormControl('', { nonNullable: true });

  private currentPageSubject = new BehaviorSubject(1);
  currentPageAction$ = this.currentPageSubject.asObservable();
  private selectedRegionSubject = new BehaviorSubject('all');
  selectedRegionAction$ = this.selectedRegionSubject.asObservable();

  searchAction$ = this.searchFormControl.valueChanges.pipe(
    startWith(''),
    debounceTime(500),
    distinctUntilChanged(),
    tap(() => this.currentPageSubject.next(1)),
  );

  // Server-side filtering and pagination
  finalPageData$ = combineLatest([
    this.searchAction$,
    this.selectedRegionAction$,
    this.currentPageAction$,
  ]).pipe(
    debounceTime(0),
    tap(([search, region, page]) =>
      console.log('Stream emitted:', { search, region, page }),
    ),
    switchMap(([search, region, page]) =>
      this.countriesService
        .getAllCountries(
          search || undefined,
          region !== 'all' ? region : undefined,
          page,
          this.pageSize,
        )
        .pipe(
          map((response) => ({ response, page })),
          catchError((err) => {
            this.errMessage = err;
            console.error('Error in getAllCountries:', err);
            return EMPTY;
          }),
        ),
    ),
    scan(
      (acc: PaginatedResponse<ICountry>, curr) => {
        if (curr.page === 1) {
          return curr.response;
        }
        return {
          ...curr.response,
          items: [...acc.items, ...curr.response.items],
        };
      },
      {
        items: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
      } as PaginatedResponse<ICountry>,
    ),
    tap((data) => {
      this.totalPages = data.totalPages;
      console.log('Data received:', data);
    }),
  );

  constructor(
    private countriesService: CountriesService,
    private titleService: Title,
  ) {}

  ngOnInit(): void {
    this.pageTitle = this.titleService.getTitle();
  }

  trackByFn(index: number, country: ICountry) {
    return country.alpha3Code;
  }

  onScroll() {
    if (this.currentPageSubject.value < this.totalPages) {
      this.currentPageSubject.next(this.currentPageSubject.value + 1);
    }
  }

  onRegionSelectionChanged(region: string) {
    this.currentPageSubject.next(1); // Reset to page 1
    this.selectedRegionSubject.next(region);
  }
}

// TODO: 1. Extract all business logic to a service
// TODO: 2. Make component DRY
