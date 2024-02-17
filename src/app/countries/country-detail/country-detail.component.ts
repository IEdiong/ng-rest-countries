import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { CountryService } from '../shared/country.service';
import { ICountry } from '../shared/country.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'rc-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.scss'],
})
export class CountryDetailComponent implements OnInit {
  languages!: string;
  countryDetail$!: Observable<ICountry>;

  constructor(
    private countryService: CountryService,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {}

  onBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    const name: string = this.activatedRoute.snapshot.params['countryName'];
    this.countryDetail$ = this.countryService.singleCountry(name);
  }
}

/* .subscribe((data) => {
  // Set country object
  this.country = data;
  // Set languages string
  this.languages = data.languages.map((obj) => obj.name).join(', ');
  this.loading = false;
}); */

// TODO: 1. Get the route parameters as an Observable
