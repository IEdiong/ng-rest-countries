import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CountriesRoutingModule } from './countries-routing.module';
import { CountryComponent } from './country/country.component';
import { CountriesComponent } from './countries.component';
import { CountryListComponent } from './country-list/country-list.component';

@NgModule({
  declarations: [
    CountryComponent,
    CountriesComponent,
    CountryListComponent
  ],
  imports: [CommonModule, CountriesRoutingModule],
})
export class CountriesModule {}
