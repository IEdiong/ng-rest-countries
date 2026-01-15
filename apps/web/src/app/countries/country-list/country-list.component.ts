import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ICountry, PaginatedResponse } from '@rest-countries/shared';
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
  tap,
} from 'rxjs';
import { CountriesService } from '../countries.service';
import { ToolbarComponent } from '@shared/toolbar/toolbar.component';
import { CountryComponent } from '@countries/country/country.component';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'rc-country-list',
  imports: [
    ToolbarComponent,
    CountryComponent,
    AsyncPipe,
    InfiniteScrollDirective,
  ],
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryListComponent implements OnInit {
  private readonly countriesService = inject(CountriesService);
  private readonly titleService = inject(Title);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  pageSize = 20;
  pageTitle = '';
  errMessage = '';
  totalPages = 0;
  searchFormControl = new FormControl('', { nonNullable: true });

  private currentPageSubject = new BehaviorSubject(1);
  currentPageAction$ = this.currentPageSubject.asObservable();

  // Source of truth for filters comes from the route
  private routeParams$ = this.route.queryParams.pipe(
    map((params) => ({
      search: params['search'] || '',
      region: params['region'] || 'all',
    })),
    distinctUntilChanged(
      (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr),
    ),
    tap(({ search }) => {
      // Keep form control in sync with route (e.g. for back button)
      if (this.searchFormControl.value !== search) {
        this.searchFormControl.setValue(search, { emitEvent: false });
      }
      // Reset to page 1 whenever filters change
      this.currentPageSubject.next(1);
    }),
  );

  // Server-side filtering and pagination reacting to route state
  finalPageData$ = combineLatest([
    this.routeParams$,
    this.currentPageAction$,
  ]).pipe(
    debounceTime(0), // Bundle emissions from queryParams + page reset
    tap(([params, page]) =>
      console.log('Stream emitted:', { ...params, page }),
    ),
    switchMap(([{ search, region }, page]) =>
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

  ngOnInit(): void {
    this.pageTitle = this.titleService.getTitle();

    // Update route when search input changes
    this.searchFormControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((search) => {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { search: search || null },
          queryParamsHandling: 'merge',
          replaceUrl: true,
        });
      });
  }

  protected onScroll() {
    if (this.currentPageSubject.value < this.totalPages) {
      this.currentPageSubject.next(this.currentPageSubject.value + 1);
    }
  }

  protected onRegionSelectionChanged(region: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { region: region === 'all' ? null : region },
      queryParamsHandling: 'merge',
    });
  }
}

// TODO: 1. Extract all business logic to a service
// TODO: 2. Make component DRY
