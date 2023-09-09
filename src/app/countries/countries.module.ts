import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CountriesRoutingModule } from './countries-routing.module';
import { CountryComponent } from './country/country.component';
import { CountriesComponent } from './countries.component';
import { CountryListComponent } from './country-list/country-list.component';
import { CountryDetailComponent } from './country-detail/country-detail.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    CountryComponent,
    CountriesComponent,
    CountryListComponent,
    CountryDetailComponent,
  ],
  imports: [CommonModule, CountriesRoutingModule, SharedModule],
  exports: [CountriesComponent],
})
export class CountriesModule {}
