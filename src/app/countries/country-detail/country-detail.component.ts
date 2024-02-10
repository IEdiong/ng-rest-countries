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
  languages!: string;
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
    this.countryService.singleCountry(name).subscribe((data) => {
      // Set country object
      this.country = data;
      // Set languages string
      this.languages = data.languages.map((obj) => obj.name).join(', ');
      this.loading = false;
    });
  }
}
