import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CountriesComponent } from '@countries/countries.component';
import { HeaderComponent } from '@shared/header/header.component';

@Component({
  selector: 'rc-root',
  imports: [HeaderComponent, CountriesComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
