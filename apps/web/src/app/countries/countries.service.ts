import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

import { CACHING_ENABLED } from '../core/interceptors/cache.interceptor';
import { ICountry, PaginatedResponse } from '@rest-countries/shared';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  private http = inject(HttpClient);

  /**
   * Get all countries with optional filtering and pagination
   * @param search Search query for name or capital
   * @param region Region filter
   * @param page Page number (default: 1)
   * @param limit Items per page (default: 20)
   * @returns Observable of paginated countries
   */
  getAllCountries(
    search?: string,
    region?: string,
    page = 1,
    limit = 20,
  ): Observable<PaginatedResponse<ICountry>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (search) {
      params = params.set('search', search);
    }
    if (region && region !== 'all') {
      params = params.set('region', region);
    }

    return this.http
      .get<PaginatedResponse<ICountry>>(environment.baseUrl, {
        params,
        context: new HttpContext().set(CACHING_ENABLED, true),
      })
      .pipe(
        map((response) => ({
          ...response,
          data: this.sortCountries(response.data),
        })),
        catchError(this.handleError),
      );
  }

  // Legacy support - returns all countries without pagination
  allCountries$ = this.getAllCountries(undefined, undefined, 1, 250).pipe(
    map((response) => response.data),
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
   * Get a single country by alpha3 code
   * @param alpha Alpha3 code of the country
   * @returns An Observable of a single country
   */
  singleCountry(alpha: string): Observable<ICountry> {
    const url = `${environment.baseUrl}/${alpha}`;

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
