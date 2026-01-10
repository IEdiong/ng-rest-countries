import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';

import { CACHING_ENABLED } from '../core/interceptors/cache.interceptor';
import { ICountry } from '../shared/interfaces/country.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  private http = inject(HttpClient);

  allCountries$ = this.http
    .get<ICountry[]>(`${environment.baseUrl}/all`, {
      context: new HttpContext().set(CACHING_ENABLED, true),
    })
    .pipe(
      map((data) => this.sortCountries(data)),
      catchError(this.handleError),
    );

  countriesWithCodeName$ = this.allCountries$.pipe(
    map((countries) =>
      countries.map((country) => ({
        name: country.name,
        code: country.alpha3Code,
      })),
    ),
  );

  /**
   * Observable of a single country
   * @param name Name of the country
   * @returns An Observable of a single country
   */
  singleCountry(alpha: string) {
    const url = `${environment.baseUrl}/alpha/${alpha}`;

    return this.http.get<ICountry>(url, {
      context: new HttpContext().set(CACHING_ENABLED, true),
    });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error,
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.'),
    );
  }

  private sortCountries(data: ICountry[]): ICountry[] {
    const favArr: ICountry[] = [];
    ['Germany', 'United States of America', 'Brazil', 'Iceland'].forEach(
      (el) => {
        const tempData = data.find((cty) => cty.name === el);
        if (tempData !== undefined) favArr.push(tempData);
        data = data.filter((cty) => cty.name !== el);
      },
    );
    return [...favArr, ...data];
  }
}
