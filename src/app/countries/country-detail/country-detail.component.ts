import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { CountryService } from '../shared/country.service';
import { ICountry, ICountryLanguage } from '../shared/country.model';

@Component({
  selector: 'rc-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.scss'],
})
export class CountryDetailComponent implements OnInit {
  country!: ICountry;
  languages!: ICountryLanguage[];
  loading: boolean = false;

  constructor(
    private countryService: CountryService,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {}

  onBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.loading = true;
    const name: string = this.activatedRoute.snapshot.params['countryName'];
    this.countryService.getCountry(name).subscribe((data) => {
      // console.log(data[0]);
      this.country = data[0];
      this.languages = this.country.languages;
      this.loading = false;
    });
  }
}
