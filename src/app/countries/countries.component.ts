import { Component, OnInit } from '@angular/core';
import { CountryService } from './shared/country.service';

@Component({
  selector: 'rc-countries',
  templateUrl: './countries.component.html',
  styles: [],
})
export class CountriesComponent implements OnInit {
  constructor(private countryService: CountryService) {}

  ngOnInit(): void {
    this.countryService.getCountries().subscribe((data) => {
      console.log(data);
    });
  }
}
