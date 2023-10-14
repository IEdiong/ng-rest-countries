import { Component, Input, OnInit } from '@angular/core';
import { ICountry } from '../shared/country.model';

@Component({
  selector: 'rc-country',
  templateUrl: './country.component.html',
  styles: [],
})
export class CountryComponent implements OnInit {
  @Input() country!: ICountry;
  loading: boolean = true;

  ngOnInit(): void {
    console.log('Loading country');

    this.loading = false;
  }
}
