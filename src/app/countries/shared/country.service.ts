import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
} from '@angular/common/http';
import { ICountry } from './country.model';
import { catchError, map, tap, throwError } from 'rxjs';
import { CACHING_ENABLED } from 'src/app/core/interceptors/cache.interceptor';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private allCountriesUrl = 'https://restcountries.com/v2/all';

  constructor(private http: HttpClient) {}

  /**
   * Observable of all countries
   */
  countries$ = this.http
    .get<ICountry[]>(this.allCountriesUrl, {
      context: new HttpContext().set(CACHING_ENABLED, true),
    })
    .pipe(
      map((data) => this.sortCountries(data)),
      tap((data) => console.log(data)),
      catchError(this.handleError)
    );

  /**
   * Observable of a single country
   * @param name Name of the country
   * @returns An Observable of a single country
   */
  singleCountry(name: string) {
    const url = `https://restcountries.com/v2/name/${name}?fullText=true`;

    return this.http
      .get<ICountry[]>(url, {
        context: new HttpContext().set(CACHING_ENABLED, true),
      })
      .pipe(
        map((res) => res[0]),
        tap((data) => console.log('Single country', data))
      );
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
        error.error
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }

  private sortCountries(data: ICountry[]): ICountry[] {
    let favArr: ICountry[] = [];
    ['Germany', 'United States of America', 'Brazil', 'Iceland'].forEach(
      (el) => {
        let tempData = data.find((cty) => cty.name === el);
        if (tempData !== undefined) favArr.push(tempData);
        data = data.filter((cty) => cty.name !== el);
      }
    );
    return [...favArr, ...data];
  }
}
