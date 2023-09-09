import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CountriesRoutingModule } from './countries-routing.module';
import { CountryComponent } from './country/country.component';

@NgModule({
  declarations: [
    CountryComponent
  ],
  imports: [CommonModule, CountriesRoutingModule],
})
export class CountriesModule {}
