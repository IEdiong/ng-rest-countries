import { Component, OnInit } from '@angular/core';
import { ICountry } from '../shared/country.model';
import { CountryService } from '../shared/country.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'rc-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.scss'],
})
export class CountryListComponent implements OnInit {
  countries$: Observable<ICountry[]> | undefined;

  // TODO: Handle error from observable

  constructor(private countryService: CountryService) {}

  ngOnInit(): void {
    this.countries$ = this.countryService.countries$;
  }
}
