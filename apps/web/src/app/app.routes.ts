import { Routes } from '@angular/router';
import { CountryListComponent } from '@countries/country-list/country-list.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/countries',
    pathMatch: 'full',
  },
  {
    path: 'countries',
    children: [
      { path: '', component: CountryListComponent },
      {
        path: ':countryCode',
        loadComponent: () =>
          import('@countries/country-detail/country-detail.component').then(
            (m) => m.CountryDetailComponent,
          ),
      },
    ],
  },
];
