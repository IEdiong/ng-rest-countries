import { Component, OnInit } from '@angular/core';
import { ICountry } from '../shared/country.model';
import { CountryService } from '../shared/country.service';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';

@Component({
  selector: 'rc-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.scss'],
})
export class CountryListComponent implements OnInit {
  currentPage$ = new BehaviorSubject(1);
  currentPageData$: Observable<ICountry[]> | undefined;

  // TODO: 1. Handle error from observable

  constructor(private countryService: CountryService) {}

  ngOnInit(): void {
    this.currentPageData$ = this.currentPage$.pipe(
      switchMap((currentPage: number) =>
        this.countryService.getAllCountries(currentPage)
      )
    );
  }

  onScroll() {
    this.currentPage$.next(this.currentPage$.value + 1);
  }
}
