import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ICountry } from '@shared/interfaces';

@Component({
  selector: 'rc-country',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './country.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryComponent {
  @Input() country!: ICountry;
}
