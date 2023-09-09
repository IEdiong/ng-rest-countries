import { Component, Input } from '@angular/core';
import { ICountry } from '../shared/country.model';

@Component({
  selector: 'rc-country',
  templateUrl: './country.component.html',
  styles: [],
})
export class CountryComponent {
  @Input() country!: ICountry;
}
