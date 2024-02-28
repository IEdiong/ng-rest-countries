import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ICountry } from '@shared/interfaces';

@Component({
  selector: 'rc-country',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './country.component.html',
})
export class CountryComponent {
  @Input() country!: ICountry;
}
