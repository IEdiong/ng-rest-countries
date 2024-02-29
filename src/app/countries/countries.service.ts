import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
} from '@angular/common/http';
import { ICountry } from '../shared/interfaces/country.model';
import { catchError, map, throwError } from 'rxjs';
import { CACHING_ENABLED } from 'src/app/core/interceptors/cache.interceptor';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  constructor(private http: HttpClient) {}

  allCountries$ = this.http
    .get<ICountry[]>(`${environment.baseUrl}/all`, {
      context: new HttpContext().set(CACHING_ENABLED, true),
    })
    .pipe(
      map((data) => this.sortCountries(data)),
      catchError(this.handleError),
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
