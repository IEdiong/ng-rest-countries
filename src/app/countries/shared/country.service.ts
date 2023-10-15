import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICountry } from './country.model';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private url = 'https://restcountries.com/v2/all';

  constructor(private http: HttpClient) {}

  getCountries() {
    return this.http.get<ICountry[]>(this.url).pipe(
      map((data) => {
        let favArr: ICountry[] = [];
        ['Germany', 'United States of America', 'Brazil', 'Iceland'].forEach(
          (el) => {
            let tempData = data.find((cty) => cty.name === el);
            if (tempData !== undefined) favArr.push(tempData);
            data = data.filter((cty) => cty.name !== el);
          }
        );
        return [...favArr, ...data];
      })
    );
  }

  getCountry(name: string) {
    const url = `https://restcountries.com/v2/name/${name}?fullText=true`;

    return this.http.get<ICountry[]>(url);
  }
}
