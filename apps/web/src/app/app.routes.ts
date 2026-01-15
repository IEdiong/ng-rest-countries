import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/countries',
    pathMatch: 'full',
  },
  {
    path: 'countries',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('@countries/country-list/country-list.component').then(
            (m) => m.CountryListComponent,
          ),
      },
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
