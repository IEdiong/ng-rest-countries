import { Component, OnInit } from '@angular/core';
import { CountryService } from '../shared/country.service';
import { ICountry, ICountryLanguage } from '../shared/country.model';

@Component({
  selector: 'rc-country-detail',
  templateUrl: './country-detail.component.html',
  styles: [],
})
export class CountryDetailComponent implements OnInit {
  country!: ICountry;
  languages!: ICountryLanguage[];

  constructor(private countryService: CountryService) {}

  ngOnInit(): void {
    this.countryService.getCountry('Belgium').subscribe((data) => {
      console.log(data[0]);

      this.country = data[0];
      this.languages = this.country.languages;
    });
  }
}
