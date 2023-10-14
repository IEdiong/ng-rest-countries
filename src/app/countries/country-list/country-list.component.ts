import { Component, OnInit } from '@angular/core';
import { ICountry } from '../shared/country.model';
import { CountryService } from '../shared/country.service';

@Component({
  selector: 'rc-country-list',
  templateUrl: './country-list.component.html',
  styles: [],
})
export class CountryListComponent implements OnInit {
  countries: ICountry[] | undefined;
  isLoading: boolean = false;
  hasError: boolean = false;

  constructor(private countryService: CountryService) {}

  ngOnInit(): void {
    this.countryService.getCountries().subscribe({
      next: (data) => {
        console.log(data);
        let favArr: any = [];

        if (data) {
          ['Germany', 'United States of America', 'Brazil', 'Iceland'].forEach(
            (el) => {
              let tempData = data.find((cty) => cty.name === el);
              favArr.push(tempData);
              data = data.filter((cty) => cty.name !== el);
            }
          );

          setTimeout(() => {
            this.countries = [...favArr, ...data];
          }, 2000);
        }
        this.hasError = false;
        this.isLoading = false;
      },
      error: (error) => {
        this.hasError = true;
        this.isLoading = false;
        this.countries = [];
      },
    });
  }
}
