import { Component, OnInit } from '@angular/core';
import { CountryService } from '../shared/country.service';
import {
  BehaviorSubject,
  EMPTY,
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  merge,
} from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'rc-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.scss'],
})
export class CountryListComponent implements OnInit {
  pageSize = 16;
  errMessage = '';
  searchFormControl = new FormControl('', { nonNullable: true });

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

  searchAction$ = this.searchFormControl.valueChanges.pipe(
    debounceTime(500),
    distinctUntilChanged()
  );

  searchedCountries$ = combineLatest([
    this.countryService.allCountries$,
    this.searchAction$,
  ]).pipe(
    map(([countries, searchQuery]) =>
      countries.filter((country) => {
        if (searchQuery === '') return countries;
        return country.name.toLowerCase().includes(searchQuery.toLowerCase());
      })
    )
  );

  finalPageData$ = merge(this.currentPageData$, this.searchedCountries$).pipe(
    distinctUntilChanged()
  );

  constructor(private countryService: CountryService) {}

  ngOnInit(): void {
    this.searchFormControl.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe();
  }

  onScroll() {
    this.currentPageSubject.next(this.currentPageSubject.value + 1);
  }

  onRegionSelectionChanged(region: string) {
    this.selectedRegionSubject.next(region);
  }
}
